"use client"
import { useEffect, useState } from "react"
import ChatList from "../components/chat-list"
import ChatScreen from "~/components/chat-area"
import Image from "next/image"
import { Images } from "../constants/images"
import ChatInfo from "~/components/chat-info"
import { ToastContainer } from "react-toastify"
import { ConversationResponse } from "~/codegen/data-contracts"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [conversationData, setConversationData] = useState<ConversationResponse | null>(null)
  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false)
    }
  }, [selectedChat])
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} closeOnClick />
      <div className="flex flex-row justify-between h-screen">
        <ChatList
          setSelectedChat={setSelectedChat}
          setIsGroupChat={setIsGroupChat}
          setConversationData={setConversationData}
        />
        {selectedChat ? (
          <ChatScreen
            selectedChatId={selectedChat}
            isChatInfoOpen={isChatInfoOpen}
            setIsChatInfoOpen={setIsChatInfoOpen}
            isGroupChat={isGroupChat}
            conversationData={conversationData}
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

        {isChatInfoOpen && <ChatInfo isOpen={isChatInfoOpen} isGroupChat={isGroupChat} selectedChat={selectedChat} />}
      </div>
    </>
  )
}
