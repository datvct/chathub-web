"use client"
import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { IoClose, IoSearch } from "react-icons/io5"
import { useSelector } from "react-redux"
import { Images } from "~/constants/images"
import Image from "next/image"
import { useFindMessages } from "~/hooks/use-find-message"
import { RootState } from "~/lib/reudx/store"
import { formatDateTime } from "~/lib/utils"

interface ChatSearchProps {
  setIsOpen: (isOpen: boolean) => void
  conversationId: number
  setHighlightMessageId: (messageId: number | null) => void
}

const ChatSearch = ({ setIsOpen, conversationId, setHighlightMessageId }: ChatSearchProps) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { messages, loading, error, fetchMessages } = useFindMessages(conversationId, token)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsOpen])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() !== "") {
        console.log("Fetching messages...")
        fetchMessages(searchTerm)
      }
    }
  }

  const handleSelectMessage = (messageId: number) => {
    setHighlightMessageId(messageId)
    setIsOpen(false)
  }

  return (
    <div className="bg-[#292929] text-white h-screen overflow-hidden overflow-y-auto w-1/4 p-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold">Search Message</h2>
        <button onClick={() => setIsOpen(false)}>
          <IoClose size={24} />
        </button>
      </div>
      <div className="relative w-full p-4">
        <IoSearch size={20} className="absolute left-[6%] top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Enter keywords..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-[#2e2e3e] flex items-center w-full pl-10 p-2 text-white border rounded-lg"
        />
      </div>
      <div className="flex items-center justify-center text-gray-200 mt-4">
        {loading ? (
          "Loading messages..."
        ) : error ? (
          error
        ) : messages?.length ? (
          <ul className="w-full text-left flex flex-col gap-4">
            {messages.map(msg => (
              <div
                key={msg.messageId}
                className="flex items-center space-x-4"
                onClick={() => handleSelectMessage(msg.messageId)}
              >
                <Image
                  src={msg.avatar || Images.AvatarDefault}
                  alt="User Avatar"
                  width={20}
                  height={20}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-bold">{msg.sender}</p>
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-gray-300">{msg.content}</p>
                    <p className="text-gray-500 text-xs">{formatDateTime(msg.sendAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          "Enter keywords to search for messages ...."
        )}
      </div>
    </div>
  )
}

export default ChatSearch
