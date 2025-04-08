"use client";

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

interface ModalCreateGroupChatProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ModalCreateGroupChat: React.FC<ModalCreateGroupChatProps> = ({ isOpen, setIsOpen }) => {
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
    }

    const data: ConversationRequest = {
      chatType: "GROUP",
      creatorId: userId,
      participantIds: [userId, ...selectedUsers],
      groupName: groupName.trim(),
    };

    try {
      const response = await createGroupConversation(data);
      if (response) {
        toast.success(`Group "${groupName.trim()}" created successfully!`);
        setIsOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        setSearchTerm("");
      } else {
        toast.error("Failed to create group chat.");
      }
    } catch (error: any) {
      console.error("Error creating group chat:", error);
      toast.error(error.message || "An unexpected error occurred while creating the group.");
    }
  };

  // if (friendsLoading) return <div className="loader"></div>;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setGroupName("");
        setSelectedUsers([]);
        setSearchTerm("");
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
              <span className="text-[30px] font-bold">New Group Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            <div className="relative mb-4 flex-shrink-0">
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
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
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2">
              {friendsLoading ? (
                <div className="flex justify-center items-center h-full pt-10">
                  <div className="loader"></div>
                </div>
              ) : friendsError ? (
                <p className="text-center text-red-400 mt-10">{friendsError}</p>
              ) : filteredFriends.length > 0 ? (
                <ul>
                  {filteredFriends.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user.id!)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-150
                          ${selectedUsers.includes(user.id!) ? "bg-blue-200 ring-2 ring-blue-400" : "bg-white hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
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
                      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 ml-2">
                        {selectedUsers.includes(user.id!) ? (
                          <Image src={Images.IconCheckSmall} alt="Selected" width={20} height={20} />
                        ) : (
                          <FaRegCircle size={18} className="text-gray-400" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  {searchTerm ? "No friends found matching search." : "No friends available to add."}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end gap-5 flex-shrink-0">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  setGroupName("");
                  setSelectedUsers([]);
                  setSearchTerm("");
                }}
                variant="outline"
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateGroupChat()}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white
                  bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                disabled={!groupName.trim() || selectedUsers.length === 0 || groupLoading}
              >
                {groupLoading ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  );
};

export default ModalCreateGroupChat;
