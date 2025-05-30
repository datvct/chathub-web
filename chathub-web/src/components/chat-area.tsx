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
  conversationData?: (ConversationResponse & { onlineStatus: string }) | null
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

  const updateReactions = (reactions: any[], userId: number, reactionEmoji: string, senderName: string) => {
    const index = reactions.findIndex(r => r.senderName === senderName)
    if (index !== -1) {
      // Cập nhật emoji nếu user đã reaction trước đó
      const updated = [...reactions]
      updated[index] = { ...updated[index], reactionEmoji }
      return updated
    } else {
      // Thêm mới nếu chưa có
      return [...reactions, { senderName, reactionEmoji }]
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
    const reactionTopic = TOPICS.REACT_MESSAGE(conversationId.toString())

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
    const handleReaction = (message: any) => {
      const { messageId, reactionEmoji, userId, senderName } = message

      setMessages(prev =>
        prev.map(c =>
          c.id === messageId
            ? {
                ...c,
                reactions: c.reactions
                  ? updateReactions(c.reactions, userId, reactionEmoji, senderName)
                  : [{ userId, reactionEmoji }],
              }
            : c,
        ),
      )
    }
    ws.subscribe(messageTopic, handleNewMessage)
    ws.subscribe(reactionTopic, handleReaction)

    return () => {
      ws.unsubscribe(messageTopic, handleNewMessage)
      ws.unsubscribe(reactionTopic, handleReaction)
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

  const onSendFileAndText = useCallback(
    (content: string, messageType: MessageType, fileName: string, filePath: string) => {
      if (!conversationId) return

      const ws = WebSocketService.getInstance()
      const stompClient = ws.getStompClient()
      if (!stompClient) return
      const messageSend = {
        senderId: userId,
        content,
        messageType,
        conversationId,
        fileName,
        filePath,
      }

      stompClient?.publish({
        destination: `/app/sendFileMessage/${conversationId}`,
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
  return (
    <div className="flex-1 h-full w-full p-4 bg-[#3A3A3A] text-white flex flex-col relative transition-all">
      <ChatHeader
        name={conversationData?.groupName ?? conversationData?.anotherParticipantName}
        setIsChatInfoOpen={setIsChatInfoOpen}
        isChatInfoOpen={isChatInfoOpen}
        avatar={conversationData?.chatType === "GROUP" ? conversationData?.groupAvatar : conversationData?.senderAvatar}
        isChatSearchOpen={isChatSearchOpen}
        setIsChatSearchOpen={setIsChatSearchOpen}
        userId={conversationData?.anotherParticipantId != null ? conversationData.anotherParticipantId.toString() : "0"}
        isUserOnline={
          conversationData?.onlineStatus === "ONLINE" || conversationData.chatType === "GROUP" ? true : false
        }
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
          conversationId={conversationId}
        />
      </div>

      <ChatInput onSendMessage={handleSendMessage} onSendFileAndText={onSendFileAndText} />

      {isImageViewerOpen && selectedImageUrl && (
        <ModalImageViewer isOpen={isImageViewerOpen} setIsOpen={setIsImageViewerOpen} imageUrl={selectedImageUrl} />
      )}
    </div>
  )
}

export default ChatScreen
