"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Images } from "../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../styles/custom-scroll.css"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useFriends } from "~/hooks/use-friends"
import { ConversationRequest, UserDTO } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"
import { useSearchUserByNameOrPhone } from "~/hooks/use-user"
import { useDebounce } from "~/hooks/useDebounce"
import { useUserSearch } from "~/hooks/use-user"
import { toast } from "react-toastify"

interface ModalCreateNewChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalCreateNewChat: React.FC<ModalCreateNewChatProps> = ({ isOpen, setIsOpen }) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { searchResults, searchLoading, searchError, searchUsers } = useUserSearch(userId!, token!);

  const {
    friends,
    loading: friendsLoading,
    error
  } = useFriends(userId, token)
  const {
    createConversation,
    loading: conversationLoading,
  } = useConversation(userId, token)

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers(debouncedSearchTerm);
    } else {
      searchUsers("");
    }
  }, [debouncedSearchTerm, searchUsers]);

  const handleSelectUser = (userId: number) => {
    setSelectedUser(userId);
  };

  const handleCreateChat = async () => {
    if (!selectedUser) {
      console.error("No user selected.");
      toast.warn("Please select a user to chat with.");
      return;
    }

    const data: ConversationRequest = {
      chatType: "SINGLE",
      creatorId: userId!,
      participantIds: [selectedUser, userId!],
    };

    try {
      const response = await createConversation(data);
      if (response) {
        toast.success("Chat created successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to create chat.");
      }
    } catch (error: any) {
      console.error("Error creating chat:", error);
      toast.error(error.message || "Failed to create chat.");
    }
  };

  const usersToDisplay = searchTerm.trim() ? searchResults : [];

  if (friendsLoading) return <div className="loader"></div>
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
              <span className="text-[30px] font-bold">New Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            {/* Input tìm kiếm */}
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Search by phone number or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
            </div>

            {/* <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {friends.map((user) => (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3
                    hover:bg-[#93C1D2]
                  ${selectedUser === user.id ? "bg-[#7a99b8]/90" : "bg-[#fff]"}`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <Image src={user.avatar} alt="avtart" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-black">{user.name}</p>
                    <p className="text-sm text-gray-700">{user.phoneNumber}</p>
                  </div>
                  <EllipsisVertical className="ml-auto text-gray-500" />
                </li>
              ))}
            </ul> */}

            {/* Hiển thị kết quả tìm kiếm */}
            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {/* highlight-start */}
              {searchLoading && <div className="text-center text-white p-4">Searching...</div>}
              {searchError && <div className="text-center text-red-400 p-4">{searchError}</div>}
              {!searchLoading && !searchError && searchTerm.trim() && usersToDisplay.length === 0 && (
                <div className="text-center text-gray-400 p-4">No users found.</div>
              )}
              {!searchLoading && !searchError && !searchTerm.trim() && (
                <div className="text-center text-gray-400 p-4">Enter name or phone number to search.</div>
              )}
              {!searchLoading && !searchError && usersToDisplay.map((user: UserDTO) => ( // Đảm bảo type là UserDTO
                <li
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3
                    hover:bg-[#93C1D2]
                  ${selectedUser === user.id ? "bg-[#7a99b8]/90" : "bg-[#fff]"}`}
                  onClick={() => handleSelectUser(user.id!)} // Đảm bảo user.id không null/undefined
                >
                  <Image
                    src={user.avatar || Images.AvatarDefault} // Sử dụng avatar mặc định nếu không có
                    alt={user.name || 'User Avatar'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-black">{user.name}</p>
                    <p className="text-sm text-gray-700">{user.phoneNumber}</p>
                  </div>
                  {/* Icon chỉ thị lựa chọn */}
                  {selectedUser === user.id && (
                    <Image src={Images.IconCheckSmall} alt="Selected" width={20} height={20} className="ml-auto" />
                  )}
                  {/* <EllipsisVertical className="ml-auto text-gray-500" /> Bỏ icon này nếu không cần */}
                </li>
              ))}
              {/* highlight-end */}
            </ul>

            <div className="mt-6 flex justify-end gap-5">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateChat()}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r
                  from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                disabled={selectedUser === null}
              >
                Chat
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

export default ModalCreateNewChat
