"use client"

import { useEffect, useState } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: str => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
    })

    stompClient.onConnect = () => {
      console.log("✅ Connected to WebSocket")

      stompClient.subscribe("/topic/messages", message => {
        console.log("📩 Received:", message.body)
        setMessages(prev => [...prev, message.body])
      })
    }

    stompClient.activate()
    setClient(stompClient)

    return () => {
      stompClient.deactivate()
    }
  }, [])

  // Hàm gửi tin nhắn từ UI
  const sendMessage = (content: string) => {
    if (client && client.connected) {
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify({
          senderId: 4, // ID người gửi
          conversationId: 2, // ID cuộc trò chuyện
          content,
          messageType: 0,
        }),
      })
    } else {
      console.error("❌ WebSocket chưa kết nối")
    }
  }

  return { messages, sendMessage }
}

export default useWebSocket
