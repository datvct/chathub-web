// hooks/useWebSocket.ts
"use client"

import { useEffect } from "react"
import { TOPICS } from "~/constants/Topics"
import WebSocketService from "~/lib/web-socket-service"

const useWebSocket = (userId: string, token: string, conversationIds: number[], onMessage: (msg: any) => void) => {
  useEffect(() => {
    const ws = WebSocketService.getInstance()
    ws.connect(userId, token, conversationIds)

    // Đăng ký listener cho tất cả conversationId
    conversationIds.forEach(id => {
      const topic = TOPICS.MESSAGE(id.toString())
      ws.subscribe(topic, onMessage)
    })

    return () => {
      conversationIds.forEach(id => {
        const topic = TOPICS.MESSAGE(id.toString())
        ws.unsubscribe(topic, onMessage)
      })
    }
  }, [userId, token, conversationIds, onMessage])
}

export default useWebSocket
