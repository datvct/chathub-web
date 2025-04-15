"use client"

import ChatHeader from "./chat-header"
import ChatInput from "./chat-input"
import ModalImageViewer from "./modal/modal-image-viewer"
import { useEffect, useRef, useState, useCallback } from "react"
import { ConversationResponse, MessageResponse } from "~/codegen/data-contracts"
import { MessageType } from "../types/types"
import { getMessageByConversationId } from "~/lib/get-message"
import { TOPICS } from "~/constants/Topics"
import WebSocketService from "~/lib/web-socket-service"
import ChatMessage from "./chat-message"
import "../styles/css-message.css"

interface ChatScreenProps {
  conversationId: number | null
  setIsChatInfoOpen: (isOpen: boolean) => void
  isChatInfoOpen: boolean
  isGroupChat: boolean
  conversationData?: ConversationResponse | null
  isChatSearchOpen?: boolean
  setIsChatSearchOpen?: (isOpen: boolean) => void
  highlightMessageId?: number
  onRefetchConversations: () => void
  userId: number
  token?: string
}

const ChatScreen = ({
  conversationId,
  setIsChatInfoOpen,
  isChatInfoOpen,
  isGroupChat,
  conversationData,
  isChatSearchOpen,
  setIsChatSearchOpen,
  highlightMessageId,
  userId,
  token,
}: ChatScreenProps) => {
  const ws = WebSocketService.getInstance()
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [reloadTrigger, setReloadTrigger] = useState(false)

  // const refetchMessages = async () => {
  //   if (conversationId) {
  //     const response = await getMessageByConversationId(conversationId, userId, token)
  //     if (response) {
  //       const uniqueMessages = Array.from(new Map(response.map(m => [m.id, m])).values())
  //       setMessages(response)
  //     }
  //   }
  // }

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const handleImageClickInMessage = (imageUrl: string) => {
    if (imageUrl) {
      setSelectedImageUrl(imageUrl)
      setIsImageViewerOpen(true)
    }
  }

  const refetchMessages = async () => {
    if (conversationId) {
      const response = await getMessageByConversationId(conversationId, userId, token)
      if (response) {
        const uniqueMessages = Array.from(new Map(response.map(m => [m.id, m])).values())
        setMessages(response)
      }
    }
  }

  useEffect(() => {
    const fetchMessage = async () => {
      if (conversationId) {
        const response = await getMessageByConversationId(conversationId, userId, token)
        if (response) {
          setMessages(response)
        }
      }
    }
    fetchMessage()
  }, [conversationId, userId, token, reloadTrigger])

  useEffect(() => {
    if (!conversationId) return
    const messageTopic = TOPICS.MESSAGE(conversationId.toString())

    const handleNewMessage = (message: MessageResponse) => {
      setMessages(prev => {
        const index = prev.findIndex(m => m.id === message.id)
        if (index !== -1) {
          const updated = [...prev]
          updated[index] = message
          return updated
        } else {
          return [...prev, message]
        }
      })
    }

    ws.subscribe(messageTopic, handleNewMessage)
    return () => {
      ws.unsubscribe(messageTopic, handleNewMessage)
    }
  }, [conversationId, ws])

  const onSend = useCallback(
    (content: string, messageType: MessageType) => {
      if (!conversationId) return

      const ws = WebSocketService.getInstance()
      const stompClient = ws.getStompClient()
      if (!stompClient) return
      const messageSend = {
        senderId: userId,
        content,
        messageType,
        conversationId,
      }

      stompClient?.publish({
        destination: `/app/sendMessage/${conversationId}`,
        body: JSON.stringify(messageSend),
      })
    },
    [conversationId, userId],
  )

  useEffect(() => {
    if (highlightMessageId) {
      const messageElement = document.getElementById(`message-${highlightMessageId}`)
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
        messageElement.classList.add("highlight")
        setTimeout(() => messageElement.classList.remove("highlight"), 3000)
      }
    }
  }, [highlightMessageId])

  const handleSendMessage = (content: string, messageType: MessageType) => {
    if (content.trim()) {
      onSend(content, messageType)
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleRefreshMessage = () => {
    setReloadTrigger(prev => !prev)
  }

  return (
    <div className="flex-1 h-full w-full p-4 bg-[#3A3A3A] text-white flex flex-col relative transition-all">
      <ChatHeader
        name={conversationData?.groupName ?? conversationData?.senderName}
        setIsChatInfoOpen={setIsChatInfoOpen}
        isChatInfoOpen={isChatInfoOpen}
        avatar={conversationData?.chatType === "GROUP" ? conversationData?.groupAvatar : conversationData?.senderAvatar}
        isChatSearchOpen={isChatSearchOpen}
        setIsChatSearchOpen={setIsChatSearchOpen}
      />

      <div className="flex flex-col-reverse overflow-y-auto h-[75vh] custom-scrollbar">
        <ChatMessage
          messages={messages}
          userId={userId}
          isGroupChat={isGroupChat}
          messagesEndRef={messagesEndRef}
          token={token}
          refetchMessages={refetchMessages}
          onImageClick={handleImageClickInMessage}
        />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />

      {isImageViewerOpen && selectedImageUrl && (
        <ModalImageViewer isOpen={isImageViewerOpen} setIsOpen={setIsImageViewerOpen} imageUrl={selectedImageUrl} />
      )}
    </div>
  )
}

export default ChatScreen
