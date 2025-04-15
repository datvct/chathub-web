"use client"

import React, { useState, useEffect, useCallback, Fragment } from "react"
import { useSelector } from "react-redux"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Search, X, UserPlus, CheckCircle, Clock } from "lucide-react"
import { toast } from "react-toastify"
import { RootState } from "~/lib/reudx/store"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Images } from "../constants/images"

import { useFindUserByPhoneNumber } from "~/hooks/use-find-user-by-phone-number"
import { useFriends } from "~/hooks/use-friends"
import { UserDTO, FriendshipRequest, FriendRequestResponse } from "~/codegen/data-contracts"
import "../styles/custom-scroll.css"
import { FriendshipStatus } from "~/types/types"

const formatPhoneNumberForAPI = (phone: string): string => {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("+84")) {
    cleaned = "0" + cleaned.substring(3)
  } else if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned
  }
  return cleaned
}

interface ModalFindFriendProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalFindFriend: React.FC<ModalFindFriendProps> = ({ isOpen, setIsOpen }) => {
  const currentUser = useSelector((state: RootState) => state.auth)
  const token = currentUser.token
  const currentUserId = currentUser.userId

  const [phoneNumber, setPhoneNumber] = useState("")
  const [searchTriggered, setSearchTriggered] = useState(false)

  const {
    user: foundUser,
    loading: findUserLoading,
    error: findUserError,
    checkPhoneNumber,
  } = useFindUserByPhoneNumber()

  const {
    friends: currentFriends,
    loading: friendsApiLoading,
    error: friendsApiError,
    getListFriendRequests,
    sendFriendRequestHook,
    friendRequests,
  } = useFriends(currentUserId!, token!)

  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>("idle")
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSendingRequest, setIsSendingRequest] = useState(false)

  useEffect(() => {
    if (isOpen && currentUserId && token) {
      getListFriendRequests()
    }
  }, [isOpen, currentUserId, token, getListFriendRequests])

  const checkFriendship = useCallback(
    (targetUser: UserDTO) => {
      if (!currentUserId || !targetUser || !targetUser.id) {
        setFriendshipStatus("idle")
        return
      }

      if (targetUser.id === currentUserId) {
        setFriendshipStatus("is_self")
        return
      }

      if (currentFriends?.some(friend => friend.id === targetUser.id)) {
        setFriendshipStatus("already_friend")
        return
      }

      if (friendRequests) {
        const sentRequest = friendRequests.find(req => req.type === "SENT" && req.userId === targetUser.id)
        if (sentRequest) {
          setFriendshipStatus("request_sent")
          return
        }
        const receivedRequest = friendRequests.find(req => req.type === "RECEIVED" && req.userId === targetUser.id)

        if (receivedRequest) {
          setFriendshipStatus("not_friend")
          return
        }
      }

      setFriendshipStatus("not_friend")
    },
    [currentUserId, currentFriends, friendRequests],
  )

  useEffect(() => {
    setApiError(null)

    if (foundUser) {
      checkFriendship(foundUser)

      if (findUserError) setApiError(null)
    } else {
      if (findUserError && searchTriggered) {
        setFriendshipStatus("not_found")
        setApiError(findUserError)
      } else if (!searchTriggered) {
        setFriendshipStatus("idle")
        setApiError(null)
      } else {
        setFriendshipStatus("not_found")
        setApiError(null)
      }
    }
  }, [foundUser, checkFriendship, findUserError, searchTriggered])

  const handleClose = () => {
    setIsOpen(false)
    setPhoneNumber("")
    setSearchTriggered(false)
    setApiError(null)
    setFriendshipStatus("idle")
  }

  const handleSearch = async () => {
    const phoneToSearch = formatPhoneNumberForAPI(phoneNumber)
    if (!phoneToSearch || phoneToSearch.length < 10) {
      setApiError("Please enter a valid phone number (at least 10 digits).")
      setFriendshipStatus("idle")
      setSearchTriggered(true)

      return
    }
    setApiError(null)
    setFriendshipStatus("loading")
    setSearchTriggered(true)
    const result = await checkPhoneNumber(phoneToSearch)
    if (!result.isSuccess) {
    }
  }

  const handleAddFriend = async () => {
    if (!foundUser || !foundUser.id || !currentUserId || !token) {
      toast.error("Cannot send request. User information is missing.")
      return
    }
    if (friendshipStatus !== "not_friend") {
      console.warn("Cannot send request, current status:", friendshipStatus)
      return
    }

    setIsSendingRequest(true)
    setApiError(null)

    const requestData: FriendshipRequest = {
      senderId: currentUserId,
      receiverId: foundUser.id,
      message: `Hi, I'd like to add you on ChatHub!`,
    }

    const response = await sendFriendRequestHook(requestData)

    setIsSendingRequest(false)

    if (response?.statusCode === 200) {
      setFriendshipStatus("request_sent")
    } else {
      setApiError(response?.message || "Failed to send friend request.")
    }
  }

  const renderFriendStatusButton = () => {
    const isLoading = findUserLoading || friendsApiLoading || isSendingRequest || friendshipStatus === "loading"

    if (apiError && friendshipStatus !== "loading") {
      return null
    }

    switch (friendshipStatus) {
      case "is_self":
        return <p className="text-sm text-gray-500 italic whitespace-nowrap">This is you.</p>
      case "not_friend":
        return (
          <Button
            onClick={handleAddFriend}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 disabled:opacity-60"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                <UserPlus size={16} /> Add
              </>
            )}
          </Button>
        )
      case "request_sent":
        return (
          <Button
            disabled
            variant="outline"
            size="sm"
            className="border-gray-400 text-gray-600 px-3 py-1 rounded-md text-sm cursor-not-allowed flex items-center gap-1 bg-gray-100"
          >
            <Clock size={16} /> Sent
          </Button>
        )
      case "request_received":
        return <p className="text-sm text-yellow-600 italic whitespace-nowrap">Request received</p>
      case "already_friend":
        return (
          <Button
            disabled
            variant="ghost"
            size="sm"
            className="text-green-600 px-3 py-1 rounded-md text-sm cursor-not-allowed flex items-center gap-1 hover:bg-green-50"
          >
            <CheckCircle size={16} /> Friends
          </Button>
        )
      case "loading":
        return <div className="h-6 w-16"></div>
      case "not_found":
        return null
      case "idle":
      default:
        return null
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value
    setPhoneNumber(newPhone)

    if (searchTriggered) {
      setSearchTriggered(false)
      setFriendshipStatus("idle")
    }
    setApiError(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSearch()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="bg-[#385068] rounded-[20px] w-full max-w-md transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
                  <span className="text-[25px]">Find Friend</span>
                  <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/10">
                    <Image src={Images.IconCloseModal} alt="close modal" width={30} height={30} />
                  </button>
                </DialogTitle>
                <hr className="w-full border-gray-500 mb-5" />

                <div className="relative mb-4">
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full py-5 pl-10 pr-20 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm"
                  />
                  <Search className="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <Button
                    onClick={handleSearch}
                    disabled={findUserLoading || friendsApiLoading || !phoneNumber.trim()}
                    size="sm"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md disabled:opacity-50"
                  >
                    {findUserLoading || friendshipStatus === "loading" ? "Searching..." : "Search"}
                  </Button>
                </div>

                <div className="mt-4 min-h-[60px] p-1 bg-[#49627a] rounded-lg">
                  {(findUserLoading || friendshipStatus === "loading") && !apiError && (
                    <div className="flex justify-center items-center h-full py-2">
                      <div className="loader-small"></div> {}
                      <style jsx>{`
                        .loader-small {
                          width: 20px;
                          aspect-ratio: 1;
                          border-radius: 50%;
                          border: 2px solid #ccc;
                          border-top-color: #3498db;
                          animation: spin 0.6s linear infinite;
                        }
                        @keyframes spin {
                          to {
                            transform: rotate(360deg);
                          }
                        }
                      `}</style>
                    </div>
                  )}
                  {apiError && !findUserLoading && friendshipStatus !== "loading" && (
                    <div className="text-center text-red-300 text-sm py-2">{apiError}</div>
                  )}
                  {!findUserLoading && friendshipStatus !== "loading" && !apiError && foundUser && searchTriggered && (
                    <div className="bg-white rounded-md p-2 flex items-center justify-between space-x-2 shadow-sm">
                      <div className="flex items-center space-x-2 overflow-hidden flex-grow min-w-0">
                        <Image
                          src={foundUser.avatar || Images.AvatarDefault}
                          alt={foundUser.name || "User"}
                          width={36}
                          height={36}
                          className="rounded-full flex-shrink-0 object-cover"
                        />
                        <p className="text-black font-medium text-sm truncate">{foundUser.name}</p>
                      </div>
                      <div className="flex-shrink-0">{renderFriendStatusButton()}</div>
                    </div>
                  )}
                  {!findUserLoading && friendshipStatus === "not_found" && searchTriggered && !apiError && (
                    <div className="text-center text-gray-400 text-sm py-2">User not found.</div>
                  )}
                  {!searchTriggered && friendshipStatus === "idle" && !findUserLoading && !apiError && (
                    <div className="text-center text-gray-400 text-sm py-2">Enter a phone number to find a friend.</div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
export default ModalFindFriend
