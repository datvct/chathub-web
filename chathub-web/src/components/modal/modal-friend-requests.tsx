"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import React, { Fragment, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Images } from "../../constants/images"
import { Button } from "../ui/button"
import { FriendRequestResponse, FriendshipRequest } from "~/codegen/data-contracts"
import { useFriends } from "../../hooks/use-friends"
import { useSelector } from "react-redux"
import { RootState } from "../../lib/reudx/store"
import ModalConfirm from "./modal-confirm"
import { toast } from "react-toastify"

const ModalFriendRequests: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({
  isOpen,
  setIsOpen,
}) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const {
    friendRequests,
    loading,
    error,
    getListFriendRequests,
    acceptFriendRequestHook,
    rejectFriendRequestHook,
    unsentFriendRequestHook,
  } = useFriends(userId, token)

  const [activeTab, setActiveTab] = useState("received")

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null)

  useEffect(() => {
    if (isOpen && userId && token) {
      getListFriendRequests()
    }
  }, [isOpen, userId, token, getListFriendRequests])

  const receivedRequests = friendRequests?.filter(req => req.type === "RECEIVED") || []
  const sentRequests = friendRequests?.filter(req => req.type === "SENT") || []
  const requestsToDisplay = activeTab === "received" ? receivedRequests : sentRequests

  const openConfirmation = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction()
    }
    setIsConfirmOpen(false)
  }

  const handleAccept = useCallback(
    async (senderId: number | undefined) => {
      if (!senderId || !userId) return
      const requestData: FriendshipRequest = { senderId, receiverId: userId }
      await acceptFriendRequestHook(requestData)
    },
    [userId, acceptFriendRequestHook],
  )

  const handleReject = useCallback(
    (sender: FriendRequestResponse | undefined) => {
      if (!sender || !sender.userId || !userId) return
      const senderId = sender.userId
      const requestData: FriendshipRequest = { senderId, receiverId: userId }

      openConfirmation(
        "Reject Friend Request",
        `Are you sure you want to reject the friend request from ${sender.name}?`,
        async () => {
          await rejectFriendRequestHook(requestData)
        },
      )
    },
    [userId, rejectFriendRequestHook],
  )

  const handleUnsent = useCallback(
    (receiver: FriendRequestResponse | undefined) => {
      if (!receiver || !receiver.userId) return
      const friendId = receiver.userId

      openConfirmation(
        "Unsend Friend Request",
        `Are you sure you want to unsend the friend request to ${receiver.name}?`,
        async () => {
          await unsentFriendRequestHook(friendId)
        },
      )
    },
    [unsentFriendRequestHook],
  )

  return (
    <>
      { }
      <ModalConfirm
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={handleConfirm}
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          { }
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <DialogPanel className="bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-2xl max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all flex flex-col">
                  <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6 flex-shrink-0">
                    <div className="flex items-center gap-x-2">
                      <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                      <span className="text-[25px] font-bold">Friend Requests</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                      <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                    </button>
                  </DialogTitle>

                  <hr className="w-full border-gray-500 mb-3 flex-shrink-0" />

                  <div className="relative mb-4 flex-shrink-0">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab("received")}
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-150
                        ${activeTab === "received" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#6a40b5]"}`}
                      >
                        Received ({receivedRequests.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("sent")}
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-150
                        ${activeTab === "sent" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#6a40b5]"}`}
                      >
                        Sent ({sentRequests.length})
                      </button>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {loading && (
                      <div className="flex justify-center items-center py-4">
                        <div className="loader"></div> { }
                      </div>
                    )}
                    {error && <p className="text-red-400 text-center py-2">{error}</p>}
                  </div>

                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                    {!loading && !error && requestsToDisplay.length === 0 && (
                      <p className="text-center text-gray-400 mt-8">No {activeTab} requests found.</p>
                    )}
                    {!loading &&
                      !error &&
                      requestsToDisplay.length > 0 &&
                      requestsToDisplay.map(request => (
                        <div
                          key={request.userId}
                          className="flex items-center odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg p-3 mb-3 space-x-3 transition-shadow duration-150 hover:shadow-md"
                        >
                          <Image
                            src={request.avatar || Images.AvatarDefault}
                            alt={request.name || "User Avatar"}
                            width={45}
                            height={45}
                            className="rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-black font-semibold truncate">{request.name || "Unknown User"}</p>
                            {request.message && (
                              <p className="text-gray-600 text-sm italic truncate">"{request.message}"</p>
                            )}
                          </div>
                          <div className="space-x-2 flex-shrink-0">
                            {activeTab === "received" && (
                              <>
                                <Button
                                  onClick={() => handleReject(request)}
                                  disabled={loading}
                                  variant="outline"
                                  className="px-3 py-1 text-sm border-red-500 text-red-600 hover:bg-red-50"
                                >
                                  Decline
                                </Button>
                                <Button
                                  onClick={() => handleAccept(request.userId)}
                                  disabled={loading}
                                  className="px-3 py-1 text-sm bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                                >
                                  Accept
                                </Button>
                              </>
                            )}
                            {activeTab === "sent" && (
                              <Button
                                onClick={() => handleUnsent(request)}
                                disabled={loading}
                                variant="outline"
                                className="px-3 py-1 text-sm border-gray-500 text-gray-700 hover:bg-gray-100"
                              >
                                Unsend
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalFriendRequests
