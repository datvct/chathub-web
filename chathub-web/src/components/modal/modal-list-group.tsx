"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx
import { Search, EllipsisVertical, X, LogOut, CircleX } from "lucide-react"
import "../styles/custom-scroll.css"
=======
import { Search, EllipsisVertical } from "lucide-react"
import "../../styles/custom-scroll.css"
import { LogOut } from "lucide-react"
import { CircleX } from "lucide-react"
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useConversation } from "~/hooks/use-converstation"
import { ConversationResponse } from "~/codegen/data-contracts"

interface ModalListGroupProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isAdmin: boolean
}

const ModalListGroup: React.FC<ModalListGroupProps> = ({ isOpen, setIsOpen, isAdmin }) => {
  const router = useRouter()

  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const {
    getGroupConversations,
    findGroups,
    loading: conversationHookLoading
  } = useConversation(userId!, token!);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedGroups, setDisplayedGroups] = useState<ConversationResponse[]>([]);
  const [allGroups, setAllGroups] = useState<ConversationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dataGroup, setDataGroup] = useState<ConversationResponse[]>([])
  const [groupName, setGroupName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("all")

<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx
  const groupRefs = useRef<(HTMLLIElement | null)[]>([])
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [showOptionsForGroup, setShowOptionsForGroup] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
=======
  const { groups: fetchedGroups, getGroupConversations, findGroups } = useConversation(userId, token)

  const groupRefs = useRef<(HTMLLIElement | null)[]>([])

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [showOptionsForGroup, setShowOptionsForGroup] = useState<number | null>(null)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null)
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx

  useEffect(() => {
    if (isOpen && userId && token) {
      setIsLoading(true);
      setError(null);
      getGroupConversations(userId, token)
        .then(response => {
          if (response) {
            const groupConversations = response.filter(group => group.chatType === "GROUP");
            setAllGroups(groupConversations);
            setDisplayedGroups(groupConversations);
          } else {
            setAllGroups([]);
            setDisplayedGroups([]);
          }
        })
        .catch(() => setError("Failed to load groups."))
        .finally(() => setIsLoading(false));
    } else {
      setSearchTerm("");
      setAllGroups([]);
      setDisplayedGroups([]);
      setShowOptionsForGroup(null);
    }
  }, [isOpen, userId, token, getGroupConversations]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setDisplayedGroups(allGroups);
      setError(null);
      return;
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (!userId || !token) return;
      setIsLoading(true);
      setError(null);
      try {
        const results = await findGroups(userId, searchTerm, token);
        setDisplayedGroups(results);
      } catch (err) {
        setError("Failed to search groups.");
        setDisplayedGroups([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, userId, token, findGroups, allGroups]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchTerm.trim() && userId && token) {
      event.preventDefault();

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      setIsLoading(true);
      setError(null);
      findGroups(userId, searchTerm, token)
        .then(results => {
          setDisplayedGroups(results);
        })
        .catch(() => {
          setError("Failed to search groups.");
          setDisplayedGroups([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleEllipsisClick = (index: number) => {
    if (showOptionsForGroup === index) {
      setShowOptionsForGroup(null)
    } else {
      setShowOptionsForGroup(index)
      const groupElement = groupRefs.current[index]
      if (groupElement) {
        const rect = groupElement.getBoundingClientRect()
        setModalPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        })
      }
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setShowOptionsForGroup(null)
      }}
      className="relative z-50"
    >
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
          <DialogPanel className="overflow-visible bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
              <div className="flex items-center gap-x-2">
                <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                <span className="text-[25px] font-bold">Group List</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setShowOptionsForGroup(null)
                }}
              >
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            {/* Search Bar */}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search by group name"
<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-[22px] pl-12 pr-10 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
=======
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx

            <Button
              className={`w-auto px-4 py-2 mb-2 rounded-[12px] text-lg text-white bg-[#8C8595]`}
              disabled
=======
            <Button
              className={`w-20 py-2 px-4 mb-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l
              ${activeTab === "all" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}
            `}
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx
            >
              {searchTerm ? `Results (${displayedGroups.length})` : `All (${allGroups.length})`}
            </Button>

            {/* Group List */}
            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {isLoading || conversationHookLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="loader"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-400">{error}</div>
              ) : displayedGroups.length > 0 ? (
                displayedGroups.map((group, index) => (
                  <li
                    key={group.id}
<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx
                    ref={el => { groupRefs.current[index] = el; }}
                    className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer mb-3 bg-[#fff] hover:bg-[#93C1D2]`}
                  >
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <Image
                        src={group.groupAvatar ?? Images.AvatarDefault}
                        alt={group.groupName ?? "Group Avatar"}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-black truncate">
                          {group.groupName || "Unnamed Group"}
                        </p>
                        <p className="text-sm text-gray-700 truncate">
                          {group.lastMessage ? `${group.senderName || 'System'}: ${group.lastMessage}` : "No messages yet"}
                        </p>
                      </div>
=======
                    ref={el => {
                      groupRefs.current[index] = el
                    }}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 ${
                      selectedGroup === index ? "bg-[#7a99b8]/90" : ""
                    } bg-[#fff] hover:bg-[#93C1D2]`}
                  >
                    <Image
                      src={group.groupAvatar ?? Images.AvatarDefault}
                      alt={group.groupName ?? "Group Avatar"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-black">{group.groupName || "Unnamed Group"}</p>
                      <p className="text-sm text-gray-700">{group.lastMessage || "No messages yet"}</p>
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx
                    </div>

                    <EllipsisVertical
                      className="ml-auto text-gray-500 flex-shrink-0"
                      onClick={() => handleEllipsisClick(index)}
                    />
                  </li>
                ))
              ) : (
<<<<<<< HEAD:chathub-web/src/components/modal-list-group.tsx
                <p className="text-center text-gray-400">
                  {searchTerm ? "No groups found matching search." : "No groups joined."}
                </p>
=======
                <p className="text-white">No groups found</p>
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-list-group.tsx
              )}
            </ul>

            {/* Modal Context Menu */}
            {showOptionsForGroup !== null && modalPosition && (
              <div
                className="absolute bg-gradient-to-r from-[#501794] to-[#3E70A1] rounded-md shadow-lg p-2 z-10"
                style={{
                  top: `${modalPosition.top}px`,
                  left: `${modalPosition.left - 135}px`,
                }}
              >
                <Button
                  onClick={() => {
                    setShowOptionsForGroup(null);
                  }}
                  className="w-full text-left py-1 px-2 mb-1 text-white hover:bg-[#431078]/50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Leave Group
                </Button>
                {isAdmin && (
                  <Button
                    onClick={() => {
                      setShowOptionsForGroup(null);
                    }}
                    className="w-full text-left py-1 px-2 text-red-300 hover:bg-[#431078]/50 flex items-center gap-2"
                  >
                    <CircleX size={16} /> Dissolve
                  </Button>
                )}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalListGroup
