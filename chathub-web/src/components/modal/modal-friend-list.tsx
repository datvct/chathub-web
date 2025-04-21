"use client"

import React, { Fragment, useState } from "react"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Images } from "../../constants/images"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import DropdownFriendList from "../dropdown-friend-list"
import ProfileViewModal from "./modal-profile-view"
import ModalConfirm from "./modal-confirm"
import ModalSuccess from "./modal-success"
import { useFriends } from "~/hooks/use-friends"
import { useUnfriend } from "~/hooks/use-unfriend"
import { toast } from "react-toastify"
import { UserDTO } from "~/codegen/data-contracts"
import { FriendStatus } from "~/types/types"

interface ModalFriendListProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userId: number
  token: string
}

const ModalFriendList: React.FC<ModalFriendListProps> = ({ isOpen, setIsOpen, userId, token }) => {
  const { friends: fetchedFriends, loading, error } = useFriends(userId, token, isOpen)
  const { unfriend, isUnfriending, unfriendUserId, unfriendError } = useUnfriend()

  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFriend, setSelectedFriend] = useState<UserDTO | null>(null)
  const [isProfileViewModalOpen, setIsProfileViewModalOpen] = useState(false)

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [friendIdToUnfriend, setFriendIdToUnfriend] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleOpenProfile = (friend: UserDTO) => {
    setSelectedFriend({ ...friend, gender: friend.gender as "Male" | "Female" })
    setIsProfileViewModalOpen(true)
  }

  const filteredFriends =
    fetchedFriends?.filter(friend => {
      if (!friend) return false
      const term = searchTerm.toLowerCase()
      const nameMatch = friend.name?.toLowerCase().includes(term)
      const phoneMatch = friend.phoneNumber?.includes(term)
      return nameMatch || phoneMatch
    }) || []

  const friendsToDisplay =
    activeTab === "recent" ? filteredFriends.filter(friend => friend.status === "ONLINE") : filteredFriends

  const handleUnfriendAction = async (friendId: number) => {
    if (!token || !userId || !friendId) return
    try {
      const res = await unfriend(token, userId, friendId)
      if (res === "Unfriend Success") {
        setSuccessMessage("Unfriend successfully!")
        setIsSuccessModalOpen(true)
      }
    } catch (error: any) {
      toast.error("Failed to unfriend. Please try again.")
    } finally {
      setIsOpen(false)
    }
  }

  const handleConfirmUnfriend = (friendId: number) => {
    setFriendIdToUnfriend(friendId)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmUnfriendYes = () => {
    if (friendIdToUnfriend !== null) {
      handleUnfriendAction(friendIdToUnfriend)
    }
    setIsConfirmModalOpen(false)
    setFriendIdToUnfriend(null)
  }

  const handleConfirmUnfriendCancel = () => {
    setIsConfirmModalOpen(false)
    setFriendIdToUnfriend(null)
  }
  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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
                <DialogPanel className="bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all pr-4">
                  <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
                    <div className="flex items-center gap-x-2">
                      <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                      <span className="text-[25px] font-bold">Friend List</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                      <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                    </button>
                  </DialogTitle>

                  <hr className="w-full border-gray-500 p-2 mb-3" />

                  <div className="relative mb-4 rounded-lg">
                    <Input
                      type="text"
                      placeholder="Search by name or phone number"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282] focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Search className="h-8 w-8 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pr-2" />
                  </div>

                  <div className="flex space-x-4 mb-5">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 rounded-lg text-white font-semibold
                        ${activeTab === "all" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}`}
                    >
                      All ({fetchedFriends?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("recent")}
                      className={`px-4 py-2 rounded-lg text-white font-semibold
                        ${activeTab === "recent" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}`}
                    >
                      Recently online (
                      {fetchedFriends?.filter(friend => friend.status == FriendStatus.ONLINE)?.length || 0})
                    </button>
                  </div>

                  <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="loader"></div>
                      </div>
                    ) : error ? (
                      <p className="text-red-400 text-center">{error}</p>
                    ) : !friendsToDisplay || friendsToDisplay.length === 0 ? (
                      <p className="text-center text-gray-400 mt-4">No friends found matching your search.</p>
                    ) : (
                      friendsToDisplay.map((friend, index) => {
                        return (
                          <div
                            key={friend.id || index}
                            className="flex items-center odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg p-3 mb-3 space-x-3"
                          >
                            <Image
                              src={friend.avatar || Images.AvatarDefault}
                              alt={friend.name || "Avatar"}
                              width={45}
                              height={45}
                              className="rounded-full object-cover"
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <p className="text-black font-medium">{friend.name}</p>
                              </div>
                              <p className="text-gray-600 text-sm">{friend.phoneNumber}</p>
                            </div>

                            <div className="relative flex items-center space-x-2">
                              <Button
                                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white
                                  bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l z-10 relative"
                                onClick={() => handleConfirmUnfriend(parseInt(friend.id?.toString() || "0"))}
                                disabled={isUnfriending && parseInt(friend.id?.toString() || "0") === unfriendUserId}
                              >
                                {isUnfriending && parseInt(friend.id?.toString() || "0") === unfriendUserId
                                  ? "Unfriending..."
                                  : "Unfriend"}
                              </Button>
                              <DropdownFriendList
                                friend={friend as any}
                                key={index}
                                onOpenProfile={handleOpenProfile}
                              />
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ProfileViewModal isOpen={isProfileViewModalOpen} setIsOpen={setIsProfileViewModalOpen} friend={selectedFriend} />
      <ModalConfirm
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onConfirm={handleConfirmUnfriendYes}
        onCancel={handleConfirmUnfriendCancel}
        title="Confirm Unfriend"
        message={`Are you sure you want to unfriend ${selectedFriend?.name}?`}
      />
      <ModalSuccess isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen} message={successMessage} />
    </div>
  )
}

export default ModalFriendList
