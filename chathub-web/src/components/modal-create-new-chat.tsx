"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Images } from "../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical, X, Check } from "lucide-react"
import "../styles/custom-scroll.css"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useFriends } from "~/hooks/use-friends"
import { ConversationRequest, UserDTO } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"
import { useSearchUserByNameOrPhone } from "~/hooks/use-user"
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
  const [searchTerm, setSearchTerm] = useState("")
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [displayedUsers, setDisplayedUsers] = useState<UserDTO[]>([]);
  const [currentDataSource, setCurrentDataSource] = useState<'initial_friends' | 'search_results'>('initial_friends');
  const [isLoadingDisplay, setIsLoadingDisplay] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    friends,
    loading: friendsLoading,
    error: friendsError
  } = useFriends(userId, token)

  const {
    searchUsers,
    searchResults,
    isSearching,
    searchError
  } = useUserSearch(userId!, token!)

  const {
    createConversation,
    loading: conversationLoading,
  } = useConversation(userId, token)

  const [
    isDisplayingSearchResults,
    setIsDisplayingSearchResults
  ] = useState(false)

  useEffect(() => {
    if (isOpen && !searchTerm && friends && currentDataSource === 'initial_friends') {
      setIsLoadingDisplay(friendsLoading);
      setDisplayError(friendsError);
      setDisplayedUsers(friends);
    }
  }, [isOpen, searchTerm, friends, friendsLoading, friendsError, currentDataSource]);

  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    if (!searchTerm.trim()) {
      setCurrentDataSource('initial_friends');
      if (friends) setDisplayedUsers(friends);
      setIsLoadingDisplay(friendsLoading);
      setDisplayError(friendsError);
      return;
    }

    setCurrentDataSource('search_results');
    setIsLoadingDisplay(true);
    setDisplayError(null);

    debounceTimeoutRef.current = setTimeout(() => {
      searchUsers(searchTerm);
    }, 500);

    return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
  }, [searchTerm, searchUsers, friends, friendsLoading, friendsError]);

  useEffect(() => {
    if (currentDataSource === 'search_results') {
      setIsLoadingDisplay(isSearching);
      setDisplayError(searchError);
      setDisplayedUsers(searchResults);
    }
  }, [searchResults, isSearching, searchError, currentDataSource]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      event.preventDefault();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      setCurrentDataSource('search_results');
      setIsLoadingDisplay(true);
      setDisplayError(null);
      searchUsers(searchTerm);
    }
  };


  const handleSelectUser = (userIdToSelect: number) => {
    setSelectedUser(prev => prev === userIdToSelect ? null : userIdToSelect);
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

  // if (friendsLoading) return <div className="loader"></div>
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

            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search by name or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-3 pl-10 pr-10 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
              {isLoadingDisplay ? (
                <div className="flex justify-center items-center h-full"><div className="loader"></div></div>
              ) : displayError ? (
                <p className="text-center text-red-400 mt-10">{displayError}</p>
              ) : displayedUsers && displayedUsers.length > 0 ? (
                <ul>
                  {displayedUsers.map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user.id!)}
                      className={`
                        flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-150
                        ${selectedUser === user.id ? "bg-blue-200" : "bg-white hover:bg-gray-50"}
                      `}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Image
                          src={user.avatar || Images.AvatarDefault}
                          alt={user.name || "avatar"}
                          width={40}
                          height={40}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-semibold text-black truncate">{user.name}</p>
                          <p className="text-sm text-gray-600 truncate">{user.phoneNumber}</p>
                        </div>
                      </div>
                      {selectedUser === user.id && (
                        <Check size={20} className="text-blue-600 flex-shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  {currentDataSource === 'search_results' ? "No users found." : "No friends to display."}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600 flex justify-end gap-3">
              <Button
                onClick={() => setIsOpen(false)}
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
