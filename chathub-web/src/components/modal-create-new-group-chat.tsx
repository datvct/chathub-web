"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Images } from "../constants/images";
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import { toast } from "react-toastify";
import { Search, EllipsisVertical } from "lucide-react";
import "../styles/custom-scroll.css";
import { useSelector } from "react-redux";
import { RootState } from "~/lib/reudx/store";
import { useFriends } from "~/hooks/use-friends";
import { ConversationRequest } from "~/codegen/data-contracts";
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
  const { friends, loading: friendsLoading } = useFriends(userId, token);
  const { createGroupConversation, loading: groupLoading } = useConversation(userId, token);

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroupChat = async () => {
    if (!groupName || selectedUsers.length === 0) {
      toast.error("Please provide a group name and select at least one participant.");
      return;
    }

    const data: ConversationRequest = {
      chatType: "GROUP",
      creatorId: userId,
      participantIds: [userId, ...selectedUsers],
      groupName,
    };

    try {
      const response = await createGroupConversation(data);
      if (response) {
        toast.success("Group chat created successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to create group chat.");
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
      toast.error(error.message || "Failed to create group chat.");
    }
  };

  if (friendsLoading) return <div className="loader"></div>;

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
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full py-[22px] pl-4 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
            </div>

            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {friends.map((user) => (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 hover:bg-[#93C1D2]
                  ${selectedUsers.includes(user.id) ? "bg-[#7a99b8]/90" : "bg-[#fff]"}`}
                  onClick={() => handleSelectUser(user.id)}
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
  );
};

export default ModalCreateGroupChat;