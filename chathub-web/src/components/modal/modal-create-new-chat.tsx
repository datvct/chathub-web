"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../../styles/custom-scroll.css"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useFriends } from "~/hooks/use-friends"
import { ConversationRequest } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"
import { toast } from "react-toastify"

interface ModalCreateNewChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userId: number
  token: string
}

const ModalCreateNewChat: React.FC<ModalCreateNewChatProps> = ({ isOpen, setIsOpen, token, userId }) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { friends, loading: friendsLoading, error } = useFriends(userId, token)
  const { createConversation, loading: conversationLoading } = useConversation(userId, token)

  const handleSelectUser = (userId: number) => {
    setSelectedUser(userId)
  }

  const handleCreateChat = async () => {
    if (!selectedUser) {
      console.error("No user selected.")
      return
    }

    const data: ConversationRequest = {
      chatType: "SINGLE",
      creatorId: userId,
      participantIds: [selectedUser, userId],
    }

    const formData = new FormData()

    formData.append("chatType", "SINGLE")
    formData.append("creatorId", userId.toString())
    formData.append("participantIds", userId.toString())
    formData.append("participantIds", selectedUser.toString())

    try {
      const response = await fetch("http://localhost:8080/conversation/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "content-type": "multipart/form-data",
        },
        body: formData,
      })
      if (response.status === 200) {
        toast.success("Chat created successfully!")
        setIsOpen(false)

        setSelectedUser(null)
        setSearchQuery("")
      } else {
        toast.error(error || "Failed to create chat.")
      }
    } catch (catchError: any) {
      console.error("Error creating chat:", catchError)
      toast.error(catchError.message || "Failed to create chat.")
    }
  }

  const filteredFriends =
    friends?.filter(user => {
      const searchTerm = searchQuery.toLowerCase()
      const nameMatch = user.name?.toLowerCase().includes(searchTerm)

      return nameMatch
    }) || []

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {}
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
            {}
            <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
              <span className="text-[30px] font-bold">New Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            {}
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Search friends by name"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2 w-5 h-5" /> {}
            </div>

            {}
            <div className="flex-grow overflow-hidden">
              {" "}
              {}
              {friendsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="loader"></div>
                </div>
              ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
              ) : (
                <ul className="max-h-full overflow-y-auto custom-scrollbar pr-1">
                  {" "}
                  {}
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map(user => (
                      <li
                        key={user.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 transition-colors duration-150
                        ${selectedUser === user.id ? "bg-[#7a99b8]/90" : "bg-[#fff] hover:bg-[#93C1D2]"}`}
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
                          {" "}
                          {}
                          <p className="font-semibold text-black truncate">{user.name}</p>
                          {} {}
                        </div>
                        <EllipsisVertical className="ml-auto text-gray-500 flex-shrink-0" />
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 mt-4">No friends found.</p>
                  )}
                </ul>
              )}
            </div>

            {}
            <div className="mt-6 flex justify-end gap-5 flex-shrink-0">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateChat}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedUser === null || conversationLoading}
              >
                {conversationLoading ? "..." : "Chat"}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

export default ModalCreateNewChat
