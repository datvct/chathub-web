"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Images } from "../constants/images"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../styles/custom-scroll.css"
import { useFriends } from "~/hooks/use-friends"
import { RootState } from "~/lib/reudx/store"
import { useSelector } from "react-redux"
import { ConversationRequest, UserDTO } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"

interface ModalCreateNewGroupChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalCreateNewGroupChat: React.FC<ModalCreateNewGroupChatProps> = ({ isOpen, setIsOpen }) => {
  const [selectedUsers, setSelectedUsers] = useState<UserDTO[]>([])
  const [groupName, setGroupName] = useState("")
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const { friends, loading, error } = useFriends(userId, token)
  const { createConversation } = useConversation()

  const handleUserSelect = (user: UserDTO) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleCreateChat = async () => {
    if (!selectedUsers.length) return
    const data: ConversationRequest = {
      chatType: "GROUP",
      creatorId: userId,
      participantIds: [userId, ...selectedUsers.map(u => u.id)],
      groupName: groupName,
    }
    const response = await createConversation(data, token)
    if (response) {
      setIsOpen(false)
    } else {
    }
  }

  const isCreateButtonEnabled = selectedUsers.length >= 1
  if (loading) return <p>Loading...</p>
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl h-[95%] max-h-screen rounded-[30px] transform bg-[#385068] p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-bold leading-6 text-white flex justify-between items-center"
                >
                  <span className="text-[30px] font-bold">New Group Chat</span>
                  <button onClick={() => setIsOpen(false)}>
                    <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                  </button>
                </DialogTitle>

                <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="relative mb-6">
                      <Input
                        type="text"
                        placeholder="Search friends by name"
                        className="w-full py-[22px] pl-12 pr-4 bg-[#E8ECF4] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
                      />
                      <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
                    </div>

                    <ul className="max-h-[55vh] overflow-y-auto custom-scrollbar rounded-lg p-2">
                      {friends.map((user, index) => (
                        <li
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 bg-white hover:bg-[#93C1D2]
                                                        ${selectedUsers.includes(user) ? "bg-gray-200" : ""}`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <input
                            id={`user-${user.id}`}
                            type="checkbox"
                            className="rounded border-[#d4d4d4] text-[#6568FF] focus:ring-0"
                            checked={selectedUsers.includes(user)}
                            onChange={() => handleUserSelect(user)}
                          />

                          <Image
                            src={user.avatar ?? Images.AvatarDefault}
                            alt={user.name ?? "avtar-1"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                          </div>
                          <EllipsisVertical className="ml-auto text-gray-400 w-5 h-5" />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCreateButtonEnabled && (
                    <div className="bg-[#385068] rounded-lg p-4">
                      <div className="mb-4 flex items-center gap-3 text-[#385068]">
                        <button className="w-[50px] h-[50px]" onClick={() => alert("Upload group image")}>
                          <Image src={Images.IconCamera} alt="camera icon" />
                        </button>
                        <Input
                          type="text"
                          placeholder="Enter group name"
                          className="w-full py-2 px-4 bg-[#F4F6F9] border border-gray-300 rounded-[40px] text-[#385068] focus:outline-none placeholder-[#979797]"
                          value={groupName}
                          onChange={e => setGroupName(e.target.value)}
                        />
                      </div>

                      <div className="text-lg font-semibold text-[#282828] mb-6 bg-[#F4F6F9] p-2 rounded-lg">
                        Selected Contacts
                        <span className="text-[#979797] text-sm ml-2 rounded-lg bg-[#E9E9E9] py-0.5 px-2">
                          {selectedUsers.length}/{friends.length}
                        </span>
                        <ul className="max-h-[42vh] mt-3 overflow-y-auto custom-scrollbar bg-[#F4F6F9] rounded-lg p-2">
                          {selectedUsers.map(user => {
                            const index = selectedUsers.indexOf(user)
                            return (
                              <li
                                key={index}
                                className="p-2.5 px-4 mb-2.5 rounded-lg bg-[#fff] hover:bg-gray-200 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={user.avatar ?? Images.AvatarDefault}
                                    alt={user.name ?? "avatar"}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div>
                                    <div className="font-semibold text-[#373737] text-sm md:text-base ">
                                      {user.name}
                                    </div>
                                    <p className="text-xs text-[#A6A6A6] font-normal leading-4">{user.phoneNumber}</p>
                                  </div>
                                </div>

                                <button onClick={() => handleUserSelect(user)}>
                                  <Image src={Images.IconClosePurple} alt="close" width={20} height={20} />
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-5">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleCreateChat()}
                    disabled={!isCreateButtonEnabled || groupName.trim() === ""}
                    className={`
                                w-auto px-4 py-2 rounded-[12px] text-lg text-white 
                                ${
                                  isCreateButtonEnabled && groupName.trim() !== ""
                                    ? "bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                                    : "bg-gray-400"
                                } 
                              `}
                  >
                    Create Group
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalCreateNewGroupChat
