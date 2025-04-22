"use client"

import React, { useEffect, useState, useCallback, Fragment } from "react"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { toast } from "react-toastify"

import { RootState } from "~/lib/reudx/store"
import { logout } from "~/lib/reudx/authSlice"
import { useConversation } from "~/hooks/use-converstation"
import { ConversationResponse, UserDTO } from "~/codegen/data-contracts"
import formatLastMessageTime from "~/lib/utils"
import { MessageType } from "~/types/types"
import { useBlockUnblockUser } from "~/hooks/use-user"
import { Images } from "../constants/images"
import "../styles/custom-scroll.css"
import { Search, X, AlertTriangle } from "lucide-react"

import ModalCreateNewChat from "./modal/modal-create-new-chat"
import ModalCreateNewGroupChat from "./modal/modal-create-new-group-chat"
import ModalProfile from "./modal/modal-profile"
import ChangePasswordModal from "./modal/modal-change-password"
import ModalFriendList from "./modal/modal-friend-list"
import ModalFriendRequests from "./modal/modal-friend-requests"
import ModalListGroup from "./modal/modal-list-group"
import ModalConfirm from "./modal/modal-confirm"
import ModalFindFriend from "./modal-find-friend"

import { BsPinAngleFill } from "react-icons/bs"
import { findUserById } from "~/lib/get-user"
import { send } from "process"
import { RiUnpinFill } from "react-icons/ri"

interface ChatListProps {
  setSelectedChat: (id: number) => void
  setIsGroupChat: (isGroup: boolean) => void
  setConversationData?: (data: ConversationResponse) => void
  onPinChange: () => void
  conversations: ConversationResponse[]
  userId: number
  token?: string
  // handleReloadTrigger: () => void
}

const useGetUserById = (userId: number, token?: string) => {
  const [data, setData] = useState<UserDTO | null>(null)
  useEffect(() => {
    const init = async () => {
      const data = await findUserById(userId, token)
      setData(data)
    }

    init()
  }, [userId])

  return data
}

const ChatList = ({
  setSelectedChat,
  setIsGroupChat,
  setConversationData,
  onPinChange,
  conversations,
  userId,
  token,
  // handleReloadTrigger,
}: ChatListProps) => {
  const [modalCreateChatOpen, setModalCreateNewChatOpen] = useState(false)
  const [modalCreateGroupChatOpen, setModalCreateNewGroupChatOpen] = useState(false)
  const [modalProfileOpen, setModalProfileOpen] = useState(false)
  const [isModalProfileOpen, setIsProfileModalOpen] = useState(false)
  const [isFindFriendModalOpen, setIsFindFriendModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isFriendListModalOpen, setIsFriendListModalOpen] = useState(false)
  const [isFriendRequestModalOpen, setIsFriendRequestModalOpen] = useState(false)
  const [modalListGroup, setModalListGroup] = useState(false)
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const dataProfile = useGetUserById(userId, token)

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

  const getDislayMessage = (item: ConversationResponse) => {
    if (!item.lastMessage || !item.lastMessageType) return "No messages"
    const sender = item.senderId == userId ? "You" : item.senderName
    if (item.unsent) {
      // const sender = item.senderId == userId ? "You" : item.senderName.split(" ")[0]
      return `${sender} unsent a message`
    }

    // if (item.userDeleted && item.deletedByUserId !== userId) {
    //   return "This message has been deleted"
    // }
    const truncate = (text: string, maxLength = 38) => {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
    }

    switch (item.lastMessageType) {
      case MessageType.TEXT:
        return truncate(`${sender}: ${item.lastMessage}`)
      case MessageType.IMAGE:
        return truncate(`${sender} has sent an image`)
      case MessageType.VIDEO:
        return truncate(`${sender} has sent a video`)
      case MessageType.DOCUMENT:
        return truncate(`${sender} has sent a document`)
      case MessageType.LINK:
        return truncate(`${sender} has sent a link`)
      default:
        return truncate(`${sender} has sent a file`)
    }
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      Cookies.remove("authToken", { path: "/" })
      Cookies.remove("userId", { path: "/" })

      dispatch(logout())

      setIsConfirmLogoutOpen(false)

      toast.success("Logged out successfully!")

      router.push("/sign-in")
    } catch (error) {
      toast.error("Logout failed. Please try again.")
      setIsLoggingOut(false)
    }
  }

  const confirmLogoutCancel = () => {
    setIsConfirmLogoutOpen(false)
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
              onClick={() => setIsFindFriendModalOpen(true)}
            >
              <Image src={Images.IconUserSearch} alt="Profile" width={24} height={24} />
              <span className="block ml-3 font-medium truncate">Find Friend</span>
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

          <MenuItem>
            <button
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setIsConfirmLogoutOpen(true)}
            >
              <Image src={Images.IconLogOut} alt="Group List" width={24} height={24} />
              <span className="ml-3 block font-medium truncate">Log Out</span>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-4 bg-white bg-opacity-15 text-white placeholder-gray-400 rounded-lg"
        />
      </div>

      {/* Chat List */}
      <ul className="space-y-3 overflow-y-auto custom-scrollbar h-[calc(100%-150px)]">
        {conversations.length > 0 &&
          [...conversations]
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1
              if (!a.pinned && b.pinned) return 1
              return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
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
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {chat.chatType === "GROUP" ? chat.groupName : chat.senderName}
                    </span>
                    <div className="flex items-center">
                      <span className="text-[14px] text-[#838383] mr-2">
                        {formatLastMessageTime(chat.lastMessageAt)}
                      </span>
                      {chat.pinned && <BsPinAngleFill size={20} color="white" className="text-white" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-[80%]">
                    <p className="text-sm text-[#838383] truncate">
                      {getDislayMessage(chat)
                        .trim()
                        .replace(/^"(.*)"$/, "$1")}
                    </p>
                    {chat.isSeen && (
                      <span className="bg-[#0078D4] text-xs font-bold text-white rounded-[20px] px-1 flex items-center justify-center">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {chat.pinned && <Image src={Images.IconPin} alt="Pin Icon" width={20} height={20} />}
                  </div>
                </div>
              </li>
            ))}
      </ul>

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

      <ModalCreateNewChat
        isOpen={modalCreateChatOpen}
        setIsOpen={setModalCreateNewChatOpen}
        userId={userId}
        token={token}
        onCreated={() => {
          // handleReloadTrigger?.()
        }}
        handleSelectChat={handleSelectChat}
      />
      <ModalCreateNewGroupChat
        isOpen={modalCreateGroupChatOpen}
        setIsOpen={setModalCreateNewGroupChatOpen}
        userId={userId}
        token={token}
        onCreated={() => {
          // handleReloadTrigger?.()
        }}
      />
      <ModalProfile
        isOpen={modalProfileOpen}
        setIsOpen={setModalProfileOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
        dataProfile={dataProfile}
        userId={userId}
        token={token}
      />
      {isChangePasswordModalOpen ? (
        <ChangePasswordModal isOpen={isChangePasswordModalOpen} setIsOpen={handleCloseChangePassword} />
      ) : (
        <ModalProfile
          dataProfile={dataProfile}
          isOpen={isModalProfileOpen}
          setIsOpen={setIsProfileModalOpen}
          setIsChangePasswordModalOpen={handleOpenChangePassword}
          userId={userId}
          token={token}
        />
      )}
      <ModalFriendList
        isOpen={isFriendListModalOpen}
        setIsOpen={setIsFriendListModalOpen}
        userId={userId}
        token={token}
      />
      <ModalFriendRequests isOpen={isFriendRequestModalOpen} setIsOpen={setIsFriendRequestModalOpen} />
      <ModalListGroup
        isOpen={modalListGroup}
        setIsOpen={setModalListGroup}
        isAdmin={true}
        userId={userId}
        token={token}
      />
      <ModalConfirm
        isOpen={isConfirmLogoutOpen}
        setIsOpen={setIsConfirmLogoutOpen}
        onConfirm={handleConfirmLogout}
        onCancel={confirmLogoutCancel}
        title="Confirm Logout"
        message={"Are you sure you want to log out of your account?"}
      />
      <ModalFindFriend isOpen={isFindFriendModalOpen} setIsOpen={setIsFindFriendModalOpen} />
    </div>
  )
}

export default ChatList
function dispatch(arg0: { payload: undefined; type: "auth/logout" }) {
  throw new Error("Function not implemented.")
}
