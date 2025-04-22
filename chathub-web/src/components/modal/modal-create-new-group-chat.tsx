"use client"

import React, { use, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { toast } from "react-toastify"
import { Search, EllipsisVertical, Check, Camera } from "lucide-react"
import "../../styles/custom-scroll.css"
import { useFriends } from "~/hooks/use-friends"
import { ConversationRequest } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"

interface ModalCreateGroupChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userId: number
  token: string
  onCreated?: () => void
}

const ModalCreateGroupChat: React.FC<ModalCreateGroupChatProps> = ({ isOpen, setIsOpen, userId, token, onCreated }) => {
  const [groupName, setGroupName] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { friends, loading: friendsLoading, error } = useFriends(userId, token)
  const { createGroupConversation, loading: groupLoading } = useConversation(userId, token)

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => (prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
      setSelectedFile(file)
    }
  }

  const handleCreateGroupChat = async () => {
    if (!groupName.trim()) {
      toast.error("Please provide a group name.")
      return
    }
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one participant.")
      return
    }

    const participantIds = [userId, ...selectedUsers]
    const uniqueParticipantIds = Array.from(new Set(participantIds))

    const formData = new FormData()

    formData.append("chatType", "GROUP")
    formData.append("creatorId", userId.toString())
    participantIds.forEach(id => formData.append("participantIds", id.toString()))
    formData.append("groupName", groupName)

    if (selectedFile) {
      formData.append("groupAvatar", selectedFile)
    }

    try {
      const response = await fetch("http://localhost:8080/conversation/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (response.status === 200) {
        onCreated()
        toast.success("Group chat created successfully!")
        setIsOpen(false)
        setGroupName("")
        setSelectedUsers([])
        setSelectedImage(null)
        setSearchQuery("")
      } else {
        toast.error(error || "Failed to create group chat.")
      }
    } catch (catchError: any) {
      toast.error(catchError.message || "Failed to create group chat.")
    }
  }

  useEffect(() => {
    setGroupName("")
    setSelectedImage(null)
    setSelectedFile(null)
    setSelectedUsers([])
    setSearchQuery("")
  }, [isOpen])

  const filteredFriends =
    friends?.filter(user => {
      const searchTerm = searchQuery.toLowerCase()
      const nameMatch = user.name?.toLowerCase().includes(searchTerm)
      const phoneMatch = user.phoneNumber?.toLowerCase().includes(searchTerm)
      return nameMatch || phoneMatch
    }) || []

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <TransitionChild
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
      </TransitionChild>

      <div className="fixed inset-0 flex items-center justify-center p-2">
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="bg-[#385068] rounded-[5%] p-6 w-[80%] h-[95%] max-w-lg max-h-screen transition-all transform flex flex-col">
            <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
              <span className="text-[30px] font-bold">New Group Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>
            <div className="relative mb-4 flex-shrink-0 h-[100px] w-full">
              <label htmlFor="profile-upload" className="cursor-pointer">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="profile icon"
                    className="z-10 cursor-pointer mx-auto w-[100px] h-[100px] rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                  />
                )}

                <span
                  className="z-0 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
  rounded-[50px] bg-[#F1F1F1] hover:bg-slate-300 
  w-[100px] h-[100px] flex items-center justify-center"
                >
                  <Camera className="text-[#797979] w-5 h-5" strokeWidth={1.5} />
                </span>

                <input
                  id="profile-upload"
                  type="file"
                  accept=".png,.jpg,.gif,.jpeg"
                  className="opacity-0 absolute top-0 inset-0 w-full h-full cursor-pointer"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            <div className="relative mb-4 flex-shrink-0">
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full py-[22px] pl-4 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
            </div>

            <div className="relative mb-6 flex-shrink-0">
              <Input
                type="text"
                placeholder="Search friends to add"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2 w-5 h-5" />
            </div>

            <div className="flex-grow overflow-hidden">
              {friendsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="loader"></div>
                </div>
              ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
              ) : (
                <ul className="max-h-full overflow-y-auto custom-scrollbar pr-1">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map(user => (
                      <li
                        key={user.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 transition-colors duration-150
                                ${selectedUsers.includes(user.id!) ? "bg-[#7a99b8]/90" : "bg-[#fff] hover:bg-[#93C1D2]"}`}
                        onClick={() => handleSelectUser(user.id!)}
                      >
                        <Image
                          src={user.avatar || Images.AvatarDefault}
                          alt={user.name || "avatar"}
                          width={40}
                          height={40}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-black truncate">{user.name}</p>
                        </div>

                        {selectedUsers.includes(user.id!) && <Check className="ml-auto text-green-500 flex-shrink-0" />}
                        {!selectedUsers.includes(user.id!) && (
                          <EllipsisVertical className="ml-auto text-gray-500 flex-shrink-0 opacity-50" />
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 mt-4">No friends found.</p>
                  )}
                </ul>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-5 flex-shrink-0">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroupChat}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!groupName.trim() || selectedUsers.length === 0 || groupLoading}
              >
                {groupLoading ? "..." : "Create"}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

export default ModalCreateGroupChat
