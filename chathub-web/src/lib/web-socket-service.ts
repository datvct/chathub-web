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
    this.eventEmitter.removeAllListeners()

    const topics = [
      TOPICS.STATUS,
      TOPICS.NOTIFICATIONS(userId),
      ...conversationIds.map(id => TOPICS.CONVERSATION(id.toString())),
      ...conversationIds.map(id => TOPICS.MESSAGE(id.toString())),
      ...conversationIds.map(id => TOPICS.TYPING_STATUS(id.toString())),
      ...conversationIds.map(id => TOPICS.SEEN_MESSAGE(id.toString())),
      ...conversationIds.map(id => TOPICS.REACT_MESSAGE(id.toString())),
    ]

    topics.forEach(topic => {
      const subscription = this.stompClient?.subscribe(topic, message => {
        const data = JSON.parse(message.body)
        console.log(`📩 Received from ${topic}:`, data)

        this.eventEmitter.emit(topic, data)
      })

      if (subscription) this.subscriptions.push(subscription)
    })

    console.log("✅ Subscribed to:", topics)
  }

  disconnect() {
    if (this.isConnected()) {
      this.stompClient?.deactivate()
      this.subscriptions.forEach(sub => sub.unsubscribe())
      this.subscriptions = []
    } else {
      console.error("WebSocket is not connected.")
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
