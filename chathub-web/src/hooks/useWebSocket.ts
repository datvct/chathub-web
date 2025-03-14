"use client"

import { useEffect, useState } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { MessageResponse } from "~/codegen/data-contracts"
import { getMessageByConversationId } from "~/lib/get-message"
import { MessageType } from "~/types/types"

const useWebSocket = (conversationId: number, userId: number, token?: string) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!conversationId || !userId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: MessageResponse[] = await getMessageByConversationId(
          conversationId,
          userId,
          token
        );
        setMessages(data || []);
      } catch (err) {
        setError("Failed to fetch messages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: str => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
      connectHeaders: {
        userID: userId.toString(),
      },
    });

    stompClient.onConnect = () => {
      console.log(`✅ Connected to WebSocket (Conversation: ${conversationId})`);

      stompClient.subscribe(`/topic/conversation/${conversationId}`, message => {
        const receivedMessage: MessageResponse = JSON.parse(message.body);

        setMessages(prev => [...prev, receivedMessage]);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [conversationId, userId, token]);

  const sendMessage = (content: string, messageType: MessageType) => {
    if (client && client.connected) {
      const messageRequest = {
        senderId: userId,
        content: content,
        messageType: messageType,
      };
      console.log("🚀 ~ file: useWebSocket.ts ~ line 74 ~ sendMessage ~ messageRequest", messageRequest)

      client.publish({
        destination: `/app/sendMessage/${conversationId}`,
        body: JSON.stringify(messageRequest),
        headers: { "content-type": "application/json" },
      });

    } else {
      console.error("❌ WebSocket chưa kết nối");
    }
  };

  return { messages, sendMessage, loading, error };
}

export default useWebSocket
