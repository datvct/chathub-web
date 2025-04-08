"use client"

import { useEffect, useState } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { MessageResponse } from "~/codegen/data-contracts"
import { MessageType } from "~/types/types"
import { TOPICS } from "~/constants/Topics"
import { getMessageByConversationId } from "~/lib/get-message"

const useWebSocket = (conversationId: number, userId: number, token?: string) => {
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [isUserOnline, setIsUserOnline] = useState<boolean>(false)
  useEffect(() => {
    if (!conversationId || !userId || !token) return

    // Fetch initial messages when conversationId changes
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      try {
        const data: MessageResponse[] = await getMessageByConversationId(conversationId, userId, token)
        setMessages(data || [])
      } catch (err) {
        setError("Failed to fetch messages")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: str => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
      connectHeaders: {
        userID: userId.toString(),
      },
    })

    stompClient.onConnect = () => {
      console.log(`✅ Connected to WebSocket (Conversation: ${conversationId})`)

      // Subscribe to multiple topics
      const topics = [
        TOPICS.STATUS,
        TOPICS.NOTIFICATIONS(userId.toString()),
        TOPICS.CONVERSATION(conversationId.toString()),
        TOPICS.MESSAGE(conversationId.toString()),
        TOPICS.TYPING_STATUS(conversationId.toString()),
        TOPICS.SEEN_MESSAGE(conversationId.toString()),
        TOPICS.REACT_MESSAGE(conversationId.toString()),
      ]

      topics.forEach(topic => {
        stompClient.subscribe(topic, message => {
          const data = JSON.parse(message.body)
          console.log(`📩 Received from ${topic}:`, data)

          if (topic === TOPICS.MESSAGE(conversationId.toString())) {
            setMessages(prev => [...prev, data])
          }

          if (topic === TOPICS.TYPING_STATUS(conversationId.toString())) {
            console.log("Typing status:", data)
          } else if (topic === TOPICS.SEEN_MESSAGE(conversationId.toString())) {
            console.log("Seen message status:", data)
          } else if (topic === TOPICS.REACT_MESSAGE(conversationId.toString())) {
            console.log("Message reaction:", data)
          } else if (topic === TOPICS.STATUS) {
            console.log("User status:", data)
            setIsUserOnline(data.isOnline)
          }
        })
      })
    }

    stompClient.activate()
    setClient(stompClient)

    return () => {
      stompClient.deactivate()
    }
  }, [conversationId, userId, token])

  const sendMessage = (content: string, messageType: MessageType) => {
    if (client && client.connected && conversationId) {
      const messageRequest = {
        senderId: userId,
        content: content,
        messageType: messageType,
      }
      console.log("🚀 Sending message:", messageRequest)

      client.publish({
        destination: `/app/sendMessage/${conversationId}`,
        body: JSON.stringify(messageRequest),
        headers: { "content-type": "application/json" },
      })
    } else {
      console.error("❌ WebSocket is not connected or conversationId is missing")
    }
  }

  return { messages, sendMessage, loading, error, isUserOnline }
}

export default useWebSocket
