"use client"
import { useEffect, useState } from "react"
import ChatList from "../components/chat-list"
import ChatScreen from "~/components/chat-area"
import Image from "next/image"
import { Images } from "../constants/images"
import ChatInfo from "~/components/chat-info"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
  const [isGroupChat, setIsGroupChat] = useState(false)

  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false)
    }
  }, [selectedChat])

  return (
    <div className="flex flex-row justify-between h-screen">
      <ChatList setSelectedChat={setSelectedChat} setIsGroupChat={setIsGroupChat} />
      {selectedChat ? (
        <ChatScreen
          selectedChatId={selectedChat}
          isChatInfoOpen={isChatInfoOpen}
          setIsChatInfoOpen={setIsChatInfoOpen}
        />
      ) : (
        <>
          <Image
            src={Images.Background}
            alt="background-image"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black opacity-30" />
        </>
      )}

      {isChatInfoOpen && (
        <div className="w-1/5 bg-[#292929] text-white p-4 shadow-lg transition-all">
          <ChatInfo isOpen={isChatInfoOpen} isGroupChat={isGroupChat} />
        </div>
      )}
    </div>
  )
}
