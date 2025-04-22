// lib/WebSocketService.ts

import { Client, StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { EventEmitter } from "events"
import { TOPICS } from "~/constants/Topics"

class WebSocketService {
  private static instance: WebSocketService
  private stompClient: Client | null = null
  private subscriptions: StompSubscription[] = []
  private eventEmitter = new EventEmitter()
  private subscribedConversationIds: Set<number> = new Set()

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  public getStompClient() {
    return this.stompClient
  }

  connect(userId: string, token: string, conversationIds: number[]) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(process.env.WS_URL),
      debug: str => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
      connectHeaders: {
        userID: userId,
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ WebSocket connected!")
        this.subscribeToTopics(userId, conversationIds)
      },
      onStompError: frame => {
        console.log("❌ WebSocket disconnected!")
      },
      onDisconnect: () => {
        console.log("❌ WebSocket disconnected!")
      },
    })

    this.stompClient.activate()
  }

  isConnected(): boolean {
    return this.stompClient?.active ?? false
  }

  subscribeToTopics(userId: string, conversationIds: number[]) {
    if (!this.stompClient || !this.stompClient.connected) {
      return
    }

    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptions = []
    this.subscribedConversationIds.clear()

    const topics = [
      TOPICS.STATUS,
      TOPICS.NOTIFICATIONS(userId),
      TOPICS.USER(userId),
      ...conversationIds.map(id => TOPICS.CONVERSATION(id.toString())),
      ...conversationIds.map(id => TOPICS.MESSAGE(id.toString())),
      // ...conversationIds.map(id => TOPICS.TYPING_STATUS(id.toString())),
      // ...conversationIds.map(id => TOPICS.SEEN_MESSAGE(id.toString())),
      // ...conversationIds.map(id => TOPICS.REACT_MESSAGE(id.toString())),
    ]

    topics.forEach(topic => {
      const subscription = this.stompClient?.subscribe(topic, message => {
        const data = JSON.parse(message.body)
        console.log(`📩 Received from ${topic}:`, data)

        this.eventEmitter.emit(topic, data)
      })

      if (subscription) {
        this.subscriptions.push(subscription)
        const conversationId = this.extractConversationId(topic)
        if (conversationId) {
          this.subscribedConversationIds.add(Number(conversationId))
        }
      }
    })

    console.log("✅ Subscribed to:", topics)
  }

  subscribeToConversation(conversationId: number) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket is not connected. Cannot subscribe to conversation.")
      return
    }

    if (this.subscribedConversationIds.has(conversationId)) {
      console.log(`Already subscribed to conversation ${conversationId}`)
      return
    }

    const topics = [TOPICS.CONVERSATION(conversationId.toString()), TOPICS.MESSAGE(conversationId.toString())]

    topics.forEach(topic => {
      const subscription = this.stompClient?.subscribe(topic, message => {
        const data = JSON.parse(message.body)
        console.log(`📩 Received from ${topic}:`, data)
        this.eventEmitter.emit(topic, data)
      })

      if (subscription) {
        this.subscriptions.push(subscription)
      }
    })

    this.subscribedConversationIds.add(conversationId)
    console.log(`✅ Subscribed to conversation ${conversationId}:`, topics)
  }

  private extractConversationId(topic: string): string | null {
    const match = topic.match(/\/topic\/(conversation|message|typing-status|seen-message|react-message)\/(\d+)/)
    return match ? match[2] : null
  }

  disconnect() {
    if (this.isConnected()) {
      this.stompClient?.deactivate()
      this.subscriptions.forEach(sub => sub.unsubscribe())
      this.subscriptions = []
    } else {
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback)
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    this.eventEmitter.off(event, callback)
  }
}

export default WebSocketService
