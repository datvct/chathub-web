"use client"
import Image from "next/image"
import { Images } from "~/constants/images"

import ChatHeader from "./chat-header"
import ChatInput from "./chat-input"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useMessages } from "~/hooks/use-message"
import { formatDateTime } from "~/lib/utils"
import { ConversationResponse } from "~/codegen/data-contracts"
import { useEffect, useRef } from "react"
import ".././styles/css-message.css"

interface ChatScreenProps {
  selectedChatId: number | null
  setIsChatInfoOpen: (isOpen: boolean) => void
  isChatInfoOpen: boolean
  isGroupChat: boolean
  conversationData?: ConversationResponse | null
  isChatSearchOpen?: boolean
  setIsChatSearchOpen?: (isOpen: boolean) => void
  highlightMessageId?: number
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
  const { messages, loading } = useMessages(selectedChatId, userId, token)

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

  if (!selectedChatId)
    return <div className="flex items-center justify-center text-white">Chọn một cuộc trò chuyện</div>

  return (
    <div className="flex-1 h-full w-full p-4 bg-[#3A3A3A] text-white flex flex-col relative transition-all">
      <ChatHeader
        name={conversationData?.groupName ?? messages?.[0]?.senderName}
        setIsChatInfoOpen={setIsChatInfoOpen}
        isChatInfoOpen={isChatInfoOpen}
        avatar={conversationData?.groupAvatar}
        isChatSearchOpen={isChatSearchOpen}
        setIsChatSearchOpen={setIsChatSearchOpen}
      />

      <div className="flex flex-col-reverse overflow-y-auto h-[75vh] custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center text-white">Đang tải...</div>
        ) : messages?.length ? (
          <div className="flex flex-col space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                id={`message-${msg.id}`}
                className={`message flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                {msg.senderId !== userId && (
                  <Image
                    src={Images.AvatarDefault}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="w-8 h-8 mr-2 rounded-[20px]"
                  />
                )}
                <div>
                  {isGroupChat && msg.senderId !== userId && (
                    <span className="text-xs text-gray-400">{msg.senderName}</span>
                  )}
                  {msg.messageType === "IMAGE" ? (
                    <>
                      <Image
                        src={msg.content ?? Images.ImageDefault}
                        alt="sent"
                        className="rounded-lg w-40"
                        width={150}
                        height={150}
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">{formatDateTime(msg.sentAt)}</span>
                    </>
                  ) : (
                    <p
                      className={`
                          p-3 rounded-lg w-max max-w-xs
                          ${msg.senderId === userId ? "bg-[#1566A3]" : "bg-[#484848]"
                        }`}
                    >
                      {msg.content}
                      <span className="text-xs text-gray-400 block mt-1">{formatDateTime(msg.sentAt)}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center text-white">Không có tin nhắn</div>
        )}
      </div>

      <ChatInput />
    </div>
  )
}

export default ChatScreen
