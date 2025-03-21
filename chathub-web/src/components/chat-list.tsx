"use client"

import React, { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Images } from "../constants/images"
import "../styles/custom-scroll.css"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import ModalCreateNewChat from "./modal-create-new-chat"
import ModalCreateNewGroupChat from "./modal-create-new-group-chat"
import ModalProfile from "./modal-profile"
import ChangePasswordModal from "./modal-change-password"
import ModalFriendList from "./modal-friend-list"
import ModalFriendRequests from "./modal-friend-requests"
import ModalListGroup from "./modal-list-group"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useConversation } from "~/hooks/use-converstation"
import { ConversationResponse } from "~/codegen/data-contracts"
import { BsPinAngleFill } from "react-icons/bs"
import { RiUnpinFill } from "react-icons/ri"

interface ChatListProps {
  setSelectedChat: (id: number) => void;
  setIsGroupChat: (isGroup: boolean) => void;
  setConversationData?: (data: ConversationResponse) => void;
  onPinChange: () => void;
}

const ChatList = ({
  setSelectedChat,
  setIsGroupChat,
  setConversationData,
  onPinChange,
}: ChatListProps) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const [modalCreateChatOpen, setModalCreateNewChatOpen] = useState(false)
  const [modalCreateGroupChatOpen, setModalCreateNewGroupChatOpen] = useState(false)
  const [modalProfileOpen, setModalProfileOpen] = useState(false)
  const [isModalProfileOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isFriendListModalOpen, setIsFriendListModalOpen] = useState(false)
  const [isFriendRequestModalOpen, setIsFriendRequestModalOpen] = useState(false)
  const [modalListGroup, setModalListGroup] = useState(false)
  const {
    getRecentConversation
  } = useConversation(userId, token)
  const [dataConversation, setDataConversation] = useState<ConversationResponse[]>([])

  const fetchDataConversation = async () => {
    if (userId) {
      setDataConversation([])
      const init = async () => {
        const response = await getRecentConversation(userId, token)
        if (response) {
          setDataConversation(response);
        }
      };
      init();
    }
  };

  useEffect(() => {
    fetchDataConversation();
  }, [userId, modalCreateChatOpen, modalCreateGroupChatOpen]);

  useEffect(() => {
    if (userId) {
      setDataConversation([])
      const init = async () => {
        const response = await getRecentConversation(userId, token)
        if (response) {
          setDataConversation(response)
        }
      }
      init()
    }
  }, [userId, modalCreateChatOpen, modalCreateGroupChatOpen]);

  const handleOpenChangePassword = () => {
    setIsProfileModalOpen(false)
    setIsChangePasswordModalOpen(true)
  }

  const handleCloseChangePassword = () => {
    setIsChangePasswordModalOpen(false)
    setIsProfileModalOpen(true)
  }

  const handleSelectChat = (id: number, converstation: ConversationResponse, isGroup?: boolean) => {
    setSelectedChat(id)
    setConversationData(converstation)
    setIsGroupChat(isGroup || false)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:${date.getMinutes()}`
  }

  return (
    <div className="bg-[#202020] text-white w-1/4 h-screen p-4 relative z-50">
      <Menu>
        <MenuButton as="button" className="flex items-center justify-start gap-5 mb-4">
          <Image src={Images.IconChatList} alt="Chat Icon" width={35} height={35} />
          <h1 className="text-[25px] font-bold">Chats</h1>
        </MenuButton>

        <MenuItems className="absolute top-14 left-2 bg-black border border-white border-opacity-30 w-55 p-4 rounded-[20px] shadow-md z-50 mt-2 text-left focus:outline-none">
          <MenuItem>
            <button
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setModalProfileOpen(true)}
            >
              <Image src={Images.IconProfile} alt="Profile" width={24} height={24} />
              <span className="block ml-3 font-medium truncate">Profile</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setIsFriendListModalOpen(true)}
            >
              <Image src={Images.IconContact} alt="FriendList" width={24} height={24} />
              <span className="ml-3 block font-medium truncate">Friend List</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setIsFriendRequestModalOpen(true)}
            >
              <Image src={Images.IconAddFriend} alt="Friend Requests" width={24} height={24} />
              <span className="ml-3 block font-medium truncate">Friend Requests</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setModalListGroup(true)}
            >
              <Image src={Images.IconGroup} alt="Group List" width={24} height={24} />
              <span className="ml-3 block font-medium truncate">Group List</span>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-4 bg-white bg-opacity-15 text-white placeholder-gray-400 rounded-lg"
        />
      </div>

      {/* Chat List */}
      <ul className="space-y-3 overflow-y-scroll custom-scrollbar h-[calc(100%-150px)]">
        {dataConversation.length > 0 ? (
          [...dataConversation]
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return 0;
            })
            .map((chat, index) => (
              <li
                key={`${chat.id}-${index}`}
                className={`flex items-center gap-3 p-2 rounded-lg hover:cursor-pointer`}
                onClick={() => handleSelectChat(chat.id, chat, chat.chatType === "GROUP")}
              >
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                  <Image
                    src={chat.chatType === "GROUP" ? chat.groupAvatar : chat.senderAvatar || Images.AvatarDefault}
                    alt={chat.chatType === "GROUP" ? chat.groupName : chat.senderName || "Avatar"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{chat.chatType === "GROUP" ? chat.groupName : chat.senderName}</span>
                    <div className="flex items-center">
                      <span className="text-[14px] text-[#838383] mr-2">{formatTime(chat.lastMessageAt)}</span>
                      {chat.pinned && (
                        <BsPinAngleFill size={20} color="white" className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#838383] truncate">{chat.lastMessage}</p>
                    {chat.isSeen === false && (
                      <span className="bg-[#0078D4] text-xs font-bold text-white rounded-[20px] px-1 flex items-center justify-center">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {chat.pinned && <Image src={Images.IconPin} alt="Pin Icon" width={20} height={20} />}
                    <span className="text-[14px] text-[#838383] ml-2">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                </div>
              </li>
            ))
        ) : (
          <>Loading...</>
        )}


      </ul>

      {/* Floating Button */}
      <Menu>
        <MenuButton
          as="button"
          className="absolute bottom-6 right-12 bg-white bg-opacity-30 p-4 rounded-full flex items-center justify-center text-white text-[30px]"
        >
          <Image src={Images.IconPlus} alt="Plus Icon" width={28} height={28} />
        </MenuButton>

        <MenuItems className="text-[15px] absolute bottom-16 p-2 right-12 w-56 bg-black border border-white border-opacity-30 rounded-[10px] shadow-lg">
          <MenuItem>
            <button
              className="w-full px-2 py-2 hover:bg-gray-600 cursor-pointer flex items-center rounded-lg"
              onClick={() => setModalCreateNewChatOpen(true)}
            >
              <div>
                <Image
                  src={Images.CreateNewChat}
                  alt="Create a new chat Icon"
                  width={32}
                  height={30}
                  className="flex items-center justify-center"
                />
              </div>
              <div className="ml-2">Create new chat</div>
            </button>
          </MenuItem>

          <MenuItem>
            <button
              className="w-full px-2 py-2 hover:bg-gray-600 cursor-pointer flex items-center rounded-lg"
              onClick={() => setModalCreateNewGroupChatOpen(true)}
            >
              <div>
                <Image
                  src={Images.CreateNewGroupChat}
                  alt="Create a new group Icon"
                  width={30}
                  height={30}
                  className="flex items-center justify-center"
                />
              </div>
              <div className="ml-2">Create new group chat</div>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Render the modals */}
      <ModalCreateNewChat isOpen={modalCreateChatOpen} setIsOpen={setModalCreateNewChatOpen} />
      <ModalCreateNewGroupChat isOpen={modalCreateGroupChatOpen} setIsOpen={setModalCreateNewGroupChatOpen} />
      <ModalProfile
        isOpen={modalProfileOpen}
        setIsOpen={setModalProfileOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen} friend={undefined}
      />
      {isChangePasswordModalOpen ? (
        <ChangePasswordModal isOpen={isChangePasswordModalOpen} setIsOpen={handleCloseChangePassword} />
      ) : (
        <ModalProfile
          isOpen={isModalProfileOpen}
          setIsOpen={setIsProfileModalOpen}
          setIsChangePasswordModalOpen={handleOpenChangePassword} friend={undefined}
        />
      )}
      <ModalFriendList
        isOpen={isFriendListModalOpen}
        setIsOpen={setIsFriendListModalOpen}
      />
      <ModalFriendRequests
        isOpen={isFriendRequestModalOpen}
        setIsOpen={setIsFriendRequestModalOpen}
      />
      <ModalListGroup
        isOpen={modalListGroup}
        setIsOpen={setModalListGroup}
        isAdmin={true}
      />
    </div>
  )
}

export default ChatList
