"use client"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { FaPhoneAlt } from "react-icons/fa"
import { IoSearch } from "react-icons/io5"
import { IoMdVideocam, IoMdMore } from "react-icons/io"
import { Images } from "~/constants/images"

interface ChatHeaderProps {
  name: string
  setIsChatInfoOpen: (isOpen: boolean) => void
  isChatInfoOpen: boolean
  avatar?: string
  setIsChatSearchOpen?: (isOpen: boolean) => void
  isChatSearchOpen?: boolean
  isUserOnline?: boolean
}

const ChatHeader = ({
  name,
  setIsChatInfoOpen,
  isChatInfoOpen,
  avatar,
  setIsChatSearchOpen,
  isChatSearchOpen,
  isUserOnline,
}: ChatHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between space-x-3 mb-4 border-b border-white pb-4">
      <div className="flex items-center flex-row justify-between w-full">
        <div className="flex items-center gap-3">
          <Image
            src={avatar ? avatar : Images.AvatarDefault}
            alt={name ? name : "Avatar"}
            className="w-[3.125rem] h-[3.125rem] rounded-[30px] object-cover"
            width={50}
            height={50}
          />
          <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-sm text-gray-400">{isUserOnline}</p>
          </div>
        </div>
        {/* Các nút chức năng */}
        <div className="flex gap-2.5">
          <button
            className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
            onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
          >
            <IoSearch size={20} color="white" className="text-white" />
          </button>
          <button className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center">
            <FaPhoneAlt size={20} color="white" className="text-white" />
          </button>
          <button className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center">
            <IoMdVideocam size={20} color="white" className="text-white" />
          </button>
          {/* Nút mở ChatInfo */}
          <button
            className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
            onClick={() => setIsChatInfoOpen(!isChatInfoOpen)}
          >
            <IoMdMore size={20} color="white" />
          </button>
        </div>
      </div>
      {/*
      {isOpen && (
        <div ref={menuRef} className="absolute right-0 top-16 z-50 w-full max-w-xs">
          <ChatInfo isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      )} */}
    </div>
  )
}

export default ChatHeader
