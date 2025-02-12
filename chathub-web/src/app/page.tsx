"use client"
import { useState } from "react"
import ChatList from "../components/chat-list"
import ChatScreen from "~/components/chat-area"
import Image from "next/image"
import { Images } from "../constants/images"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  return (
    <div className="flex flex-row justify-between h-screen">
      <ChatList setSelectedChat={setSelectedChat} />
      <div className="flex flex-1 items-center justify-center relative">
        {selectedChat ? (
          <ChatScreen selectedChatId={selectedChat} />
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
      </div>
    </div>
  )
}
