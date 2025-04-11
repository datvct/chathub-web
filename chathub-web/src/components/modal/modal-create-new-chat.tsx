"use client"

<<<<<<< HEAD:chathub-web/src/components/modal-create-new-chat.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Images } from "../constants/images";
import { ConversationRequest, UserDTO } from "~/codegen/data-contracts";
import { useFriends } from "~/hooks/use-friends";
import { useConversation } from "~/hooks/use-converstation";
import { Search, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import "../styles/custom-scroll.css";
import { RootState } from "~/lib/reudx/store";
=======
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
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-chat.tsx

interface ModalCreateNewChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalCreateNewChat: React.FC<ModalCreateNewChatProps> = ({ isOpen, setIsOpen }) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

<<<<<<< HEAD:chathub-web/src/components/modal-create-new-chat.tsx
  const {
    friends,
    loading: friendsLoading,
    error: friendsError
  } = useFriends(userId!, token!);
=======
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const { friends, loading: friendsLoading, error } = useFriends(userId, token)
  const { createConversation, loading: conversationLoading } = useConversation(userId, token)
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-chat.tsx

  const { createConversation, loading: conversationLoading } = useConversation(userId!, token!);


  const filteredUsers = friends?.filter(friend =>
    friend &&
    (friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.phoneNumber?.includes(searchTerm))
  ) || [];


  const handleSelectUser = (userIdToSelect: number) => {
    setSelectedUser(prev => prev === userIdToSelect ? null : userIdToSelect);
  };

  const handleCreateChat = async () => {
    if (!selectedUser) {
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-chat.tsx
      toast.error("Please select a user to chat with.");
      return;
    }
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
=======
      console.error("No user selected.")
      return
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-chat.tsx
    }

    const data: ConversationRequest = {
      chatType: "SINGLE",
      creatorId: userId,
      participantIds: [selectedUser, userId],
    }

    try {
      const response = await createConversation(data)
      if (response) {
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-chat.tsx
        toast.success("Chat created successfully!");
        setIsOpen(false);
        setSearchTerm("");
        setSelectedUser(null);
=======
        toast.success("Chat created successfully!")
        setIsOpen(false)
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-chat.tsx
      } else {
        toast.error("Failed to create chat.")
      }
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-chat.tsx
    } catch (error: any) {
      console.error("Error creating chat:", error);
      toast.error(error.message || "An unexpected error occurred while creating the chat.");
=======
    } catch (error) {
      console.error("Error creating chat:", error)
      toast.error(error.message || "Failed to create chat.")
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-chat.tsx
    }
  }


  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSearchTerm("");
        setSelectedUser(null);
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-opacity-[.40]" aria-hidden="true" />

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
          <DialogPanel className="bg-[#385068] rounded-[5%] p-6 w-[80%] h-[95%] max-w-lg max-h-screen transition-all transform">
            <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
              <span className="text-[30px] font-bold">New Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            <div className="relative mb-4 flex-shrink-0">
              <Input
                type="text"
                placeholder="Search friend by name or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-10 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm md:text-base"
              />
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2"> { }
              {friendsLoading ? (
                <div className="flex justify-center items-center h-full pt-10">
                  <div className="loader"></div>
                </div>
              ) : friendsError ? (
                <p className="text-center text-red-400 mt-10">{friendsError}</p>
              ) : filteredUsers.length > 0 ? (
                <ul>
                  {filteredUsers.map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user.id!)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-150
                        ${selectedUser === user.id ? "bg-blue-200 ring-2 ring-blue-400" : "bg-white hover:bg-gray-100"}
                      `}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0"> { }
                        <Image
                          src={user.avatar || Images.AvatarDefault}
                          alt={user.name || "avatar"}
                          width={40}
                          height={40}
                          className="rounded-full flex-shrink-0 object-cover"
                        />
                        <div className="overflow-hidden">
                          <p className="font-semibold text-black truncate text-sm md:text-base">{user.name}</p>
                          <p className="text-sm text-gray-600 truncate">{user.phoneNumber}</p>
                        </div>
                      </div>
                      {selectedUser === user.id && (
                        <Check size={20} className="text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  {searchTerm ? "No friends found matching search." : "You have no friends yet."}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600 flex justify-end gap-3 flex-shrink-0">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                  setSelectedUser(null);
                }}
                variant="outline"
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateChat()}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r
                  from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                disabled={selectedUser === null || conversationLoading}
              >
                {conversationLoading ? 'Creating...' : 'Chat'}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

export default ModalCreateNewChat
