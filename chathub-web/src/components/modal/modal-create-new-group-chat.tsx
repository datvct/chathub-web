"use client"

<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Images } from "../constants/images";
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import { toast } from "react-toastify";
import { Search, X } from "lucide-react";
import { FaRegCircle } from "react-icons/fa";
import "../styles/custom-scroll.css";
import { useSelector } from "react-redux";
import { RootState } from "~/lib/reudx/store";
import { useFriends } from "~/hooks/use-friends";
import { ConversationRequest, UserDTO } from "~/codegen/data-contracts";
import { useConversation } from "~/hooks/use-converstation";
=======
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
import React, { useState } from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { toast } from "react-toastify"
import { Search, EllipsisVertical } from "lucide-react"
import "../../styles/custom-scroll.css"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useFriends } from "~/hooks/use-friends"
import { ConversationRequest } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"
<<<<<<< HEAD
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7

interface ModalCreateGroupChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalCreateGroupChat: React.FC<ModalCreateGroupChatProps> = ({ isOpen, setIsOpen }) => {
<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const [groupName, setGroupName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { friends, loading: friendsLoading, error: friendsError } = useFriends(userId!, token!);
  const { createGroupConversation, loading: groupLoading } = useConversation(userId!, token!);

  const filteredFriends = friends?.filter(friend =>
    friend &&
    (friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.phoneNumber?.includes(searchTerm))
  ) || [];

  const handleSelectUser = (userIdToToggle: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userIdToToggle)
        ? prev.filter((id) => id !== userIdToToggle)
        : [...prev, userIdToToggle]
    );
  };

  const handleCreateGroupChat = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one friend to create a group.");
      return;
    }
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
=======
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const [groupName, setGroupName] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const { friends, loading: friendsLoading } = useFriends(userId, token)
  const { createGroupConversation, loading: groupLoading } = useConversation(userId, token)

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => (prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]))
  }

  const handleCreateGroupChat = async () => {
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Please provide a group name and select at least one participant.")
      return
<<<<<<< HEAD
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
    }

    const data: ConversationRequest = {
      chatType: "GROUP",
      creatorId: userId,
      participantIds: [userId, ...selectedUsers],
<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
      groupName: groupName.trim(),
    };
=======
      groupName,
    }
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
      groupName,
    }
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7

    try {
      const response = await createGroupConversation(data)
      if (response) {
<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
        toast.success(`Group "${groupName.trim()}" created successfully!`);
        setIsOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        setSearchTerm("");
=======
        toast.success("Group chat created successfully!")
        setIsOpen(false)
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
      } else {
        toast.error("Failed to create group chat.")
      }
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
    } catch (error: any) {
      console.error("Error creating group chat:", error);
      toast.error(error.message || "An unexpected error occurred while creating the group.");
=======
    } catch (error) {
      console.error("Error creating group chat:", error)
      toast.error(error.message || "Failed to create group chat.")
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
    }
  }

<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
  // if (friendsLoading) return <div className="loader"></div>;
=======
  if (friendsLoading) return <div className="loader"></div>
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
        toast.success("Group chat created successfully!")
        setIsOpen(false)
      } else {
        toast.error("Failed to create group chat.")
      }
    } catch (error) {
      console.error("Error creating group chat:", error)
      toast.error(error.message || "Failed to create group chat.")
    }
  }

  if (friendsLoading) return <div className="loader"></div>
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
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
              <span className="text-[30px] font-bold">New Group Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full py-3 pl-4 pr-4 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm md:text-base"
              />
            </div>

            <div className="relative mb-4 flex-shrink-0">
              <Input
                type="text"
                placeholder="Search friend to add"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-10 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm md:text-base"
              />
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
=======
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
                onChange={e => setGroupName(e.target.value)}
                className="w-full py-[22px] pl-4 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
            </div>

            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {friends.map(user => (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 hover:bg-[#93C1D2]
                  ${selectedUsers.includes(user.id) ? "bg-[#7a99b8]/90" : "bg-[#fff]"}`}
                  onClick={() => handleSelectUser(user.id)}
<<<<<<< HEAD
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
                >
                  <Image src={user.avatar} alt="avatar" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-black">{user.name}</p>
                    <p className="text-sm text-gray-700">{user.phoneNumber}</p>
                  </div>
                  <EllipsisVertical className="ml-auto text-gray-500" />
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end gap-5">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateGroupChat()}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                disabled={groupName === "" || selectedUsers.length === 0 || groupLoading}
              >
                Create
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-create-new-group-chat.tsx
export default ModalCreateGroupChat;
=======
export default ModalCreateGroupChat
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-create-new-group-chat.tsx
=======
export default ModalCreateGroupChat
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
