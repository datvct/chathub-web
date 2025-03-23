"use client"

import ChatHeader from "./chat-header"
import ChatInput from "./chat-input"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { ConversationResponse } from "~/codegen/data-contracts"
import { useEffect, useRef } from "react"
import ".././styles/css-message.css"
import useWebSocket from "~/hooks/useWebSocket"
import ChatMessage from "./chat-message"
import { MessageType } from "../types/types"

interface ChatScreenProps {
  selectedChatId: number | null
  setIsChatInfoOpen: (isOpen: boolean) => void
  isChatInfoOpen: boolean
  isGroupChat: boolean
  conversationData?: ConversationResponse | null
  isChatSearchOpen?: boolean
  setIsChatSearchOpen?: (isOpen: boolean) => void
  highlightMessageId?: number
  onRefetchConversations: () => void
}

const ChatScreen = ({
  selectedChatId,
  setIsChatInfoOpen,
  isChatInfoOpen,
  isGroupChat,
  conversationData,
  isChatSearchOpen,
  setIsChatSearchOpen,
  highlightMessageId,
}: ChatScreenProps) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.auth.userId)
  const { messages, sendMessage, loading, isUserOnline } = useWebSocket(selectedChatId, userId, token)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (highlightMessageId) {
      const messageElement = document.getElementById(`message-${highlightMessageId}`)
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" })

        messageElement.classList.add("highlight")
        setTimeout(() => {
          messageElement.classList.remove("highlight")
        }, 3000)
      }
    }
  }, [highlightMessageId])

  const handleSendMessage = (content: string, messageType: MessageType) => {
    sendMessage(content, messageType)
  }

  return (
    <div className="flex-1 h-full w-full p-4 bg-[#3A3A3A] text-white flex flex-col relative transition-all">
      <ChatHeader
        name={conversationData?.groupName ?? conversationData.senderName}
        setIsChatInfoOpen={setIsChatInfoOpen}
        isChatInfoOpen={isChatInfoOpen}
        avatar={conversationData?.groupAvatar}
        isChatSearchOpen={isChatSearchOpen}
        setIsChatSearchOpen={setIsChatSearchOpen}
        isUserOnline={isUserOnline}
      />

      <div className="flex flex-col-reverse overflow-y-auto h-[75vh] custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center text-white">Đang tải...</div>
        ) : messages?.length ? (
          <ChatMessage messages={messages} userId={userId} isGroupChat={isGroupChat} messagesEndRef={messagesEndRef} />
        ) : (
          <div className="flex items-center justify-center text-white">Không có tin nhắn</div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}

export default ChatScreen
