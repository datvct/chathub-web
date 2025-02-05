"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Images } from "../constants/images"
import "../styles/custom-scroll.css"
import { Button } from "./ui/button"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import ModalCreateNewChat from "./modal-create-new-chat"
import ModalCreateNewGroupChat from "./modal-create-new-group-chat"
import ModalProfile from "./modal-profile"
import ChangePasswordModal from "./modal-change-password"
import ModalFriendList from "./modal-friend-list";

const ChatList = () => {
  const chats = [
    { id: 1, name: "Sweetie", message: "I love you so much!", time: "8:32 PM", type: "text", pinned: true },
    { id: 2, name: "Jane Cooper", message: "Photo", time: "3:27 PM", type: "photo", pinned: true },
    { id: 3, name: "Design Review Chat", message: "Document", time: "2:49 AM", type: "document", unread: 34 },
    { id: 4, name: "R4IN80W", message: "That is how you do it!", time: "7:21 PM", type: "text" },
    { id: 5, name: "ptec", message: "You: lets do this quick", time: "6:18 PM", type: "text" },
    { id: 6, name: "480 Design", message: "Check out this new design!", time: "1:58 PM", type: "text" },
    { id: 7, name: "help! I'm in the hole", message: "Let's go", time: "10:54 AM", type: "text" },
    { id: 8, name: "kiguk", message: "Photo", time: "3:36 AM", type: "photo" },
    { id: 9, name: "iceChat", message: "I reeeeally love this animation!", time: "Thu", unread: 57 },
    { id: 10, name: "iceDSGN", message: "Happy New Year! 🎉", time: "Thu" },
  ]
  const [modalCreateChatOpen, setModalCreateNewChatOpen] = useState(false)
  const [modalCreateGroupChatOpen, setModalCreateNewGroupChatOpen] = useState(false)
  const [modalProfileOpen, setModalProfileOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isFriendListModalOpen, setIsFriendListModalOpen] = useState(false);

  return (
    <div className="bg-[#202020] text-white w-1/4 h-screen p-4 relative">
      <Menu>
        <MenuButton as="button" className="flex items-center justify-start gap-5 mb-4">
          <Image src={Images.IconChatList} alt="Chat Icon" width={35} height={35} />
          <h1 className="text-[25px] font-bold">Chats</h1>
        </MenuButton>

        <MenuItems className="absolute top-14 left-2 bg-black border border-white border-opacity-30 w-55 p-4 rounded-[20px] shadow-md z-50 mt-2 text-left focus:outline-none">
          <MenuItem>
            <button 
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setModalProfileOpen(true)}>
                <Image src={Images.IconProfile} alt="Profile" width={24} height={24} />
                <span className="block ml-3 font-medium truncate">Profile</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button 
              className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600"
              onClick={() => setIsFriendListModalOpen(true)}>
                <Image src={Images.IconContact} alt="FriendList" width={24} height={24} />
                <span className="ml-3 block font-medium truncate">Friend List</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600">
              <Image src={Images.IconAddFriend} alt="Friend Requests" width={24} height={24} />
              <span className="ml-3 block font-medium truncate">Friend Requests</span>
            </button>
          </MenuItem>

          <MenuItem>
            <button className="w-full group rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-600">
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
          className="w-full p-2 rounded pl-4 bg-white bg-opacity-15 text-white placeholder-gray-400 rounded-lg"
        />
      </div>

      {/* Chat List */}
      <ul className="space-y-3 overflow-y-scroll custom-scrollbar h-[calc(100%-150px)]">
        {chats.map(chat => (
          <li
            key={chat.id}
            className={`flex items-center gap-3 p-2 rounded-lg 
            `}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center rounded-[100px]">
              {chat.name[0]}
            </div>
            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{chat.name}</span>
                <div className="flex items-center">
                  <span className="text-[14px] text-[#838383] mr-2">{chat.time}</span>
                  {chat.pinned && <Image src={Images.IconPin} alt="Pin Icon" width={20} height={20} />}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#838383] truncate">{chat.message}</p>
                {chat.unread && (
                  <span className="bg-[#0078D4] text-xs font-bold text-white rounded-[20px] px-1 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Floating Button */}
      <Menu>
        <MenuButton
          as="button"
          className="absolute bottom-6 right-12 bg-white bg-opacity-30 p-4 rounded-full flex items-center justify-center rounded-[100px] text-white text-[30px]"
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
      <ModalProfile isOpen={modalProfileOpen} setIsOpen={setModalProfileOpen} setIsChangePasswordModalOpen = {setIsChangePasswordModalOpen} />
        {isChangePasswordModalOpen && (<ChangePasswordModal isOpen = {isChangePasswordModalOpen} setIsOpen = {setIsChangePasswordModalOpen} />
        )}
      <ModalFriendList isOpen={isFriendListModalOpen} setIsOpen={setIsFriendListModalOpen} />
    </div>
  )
}

export default ChatList
