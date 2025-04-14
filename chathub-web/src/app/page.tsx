"use client"

import { useEffect, useState, useCallback } from "react"
import ChatList from "../components/chat-list"
import ChatScreen from "~/components/chat-area"
import Image from "next/image"
import { Images } from "../constants/images"
import ChatInfo from "~/components/chat-info"
import { ToastContainer } from "react-toastify"
import { ConversationResponse } from "~/codegen/data-contracts"
import ChatSearch from "~/components/chat-search"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useConversation } from "~/hooks/use-converstation"
import WebSocketService from "~/lib/web-socket-service"
import { TOPICS } from "~/constants/Topics"
import { MessageType } from "~/types/types"

export default function Home() {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [conversationData, setConversationData] = useState<ConversationResponse | null>(null)
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false)
  const [highlightMessageId, setHighlightMessageId] = useState<number | null>(null)
  const [needRefetchConversations, setNeedRefetchConversations] = useState(false)
  const { getRecentConversation } = useConversation(userId, token)
  const [conversations, setConversations] = useState([])
  const [typingStatus, setTypingStatus] = useState({})
  const [seenMessages, setSeenMessages] = useState({})

  const handlePinChangeSuccess = useCallback(() => {
    setNeedRefetchConversations(prevState => !prevState)
    return true
  }, [])

  const handleHistoryDeletedSuccess = useCallback(() => {
    setSelectedChat(null)
    setConversationData(null)
    setNeedRefetchConversations(prev => !prev)
  }, [])

  const handleChatInfoUpdate = useCallback(() => {
    setNeedRefetchConversations(prev => !prev)
  }, [])

  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false)
      setIsChatSearchOpen(false)
    }
  }, [selectedChat])

  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false)
      setIsChatSearchOpen(false)
    }
  }, [selectedChat])

  const fetchDataConversation = async () => {
    if (userId) {
      let isMounted = true
      const init = async () => {
        try {
          const response = await getRecentConversation(userId, token)
          if (response) {
            setConversations(response)
            const conversationIds = response.map(item => item.id)
            const websocket = WebSocketService.getInstance()

            if (!websocket.isConnected()) {
              await websocket.connect(userId.toString(), token, conversationIds)
              websocket.subscribeToTopics(userId.toString(), conversationIds)
            }

            conversationIds.forEach(id => {
              WebSocketService.getInstance().subscribe(TOPICS.CONVERSATION(id.toString()), message => {
                const newConversation = message
                setConversations(prev => {
                  const exists = prev.find(c => c.id === newConversation.id)
                  return exists ? prev : [newConversation, ...prev]
                })
              })

              WebSocketService.getInstance().subscribe(TOPICS.MESSAGE(id.toString()), message => {
                const newMessage = message
                setConversations(prev => {
                  return (
                    prev
                      // .map(c =>
                      //   c.id === id
                      //     ? {
                      //         ...c,
                      //         lastMessage: newMessage.content,
                      //         lastMessageAt: newMessage.sentAt,
                      //         senderId: newMessage.senderId,
                      //         lastMessageType: newMessage.messageType,
                      //         unsent: newMessage.unsent,

                      //       }
                      //     : c,
                      // )
                      // .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                      .map(c => {
                        if (c.id !== id) return c

                        const isNew = !c.lastMessageAt || new Date(newMessage.sentAt) > new Date(c.lastMessageAt)

                        const shouldUpdateTime = isNew && !newMessage.unsent && !newMessage.userDeleted

                        return {
                          ...c,
                          lastMessage: newMessage.content,
                          lastMessageType: newMessage.messageType,
                          userDeleted: newMessage.userDeleted,
                          unsent: newMessage.unsent,
                          lastMessageAt: shouldUpdateTime ? newMessage.sentAt : c.lastMessageAt,
                        }
                      })
                  )
                })
              })

              WebSocketService.getInstance().subscribe(TOPICS.TYPING_STATUS(id.toString()), message => {
                const { userId, isTyping } = message
                setTypingStatus(prev => {
                  const updated = { ...prev, [id]: isTyping ? userId : null }
                  return updated
                })
              })

              WebSocketService.getInstance().subscribe(TOPICS.SEEN_MESSAGE(id.toString()), message => {
                const { userId, messageId } = message
                setSeenMessages(prev => ({
                  ...prev,
                  [id]: { userId, messageId },
                }))
              })

              WebSocketService.getInstance().subscribe(TOPICS.REACT_MESSAGE(id.toString()), message => {
                const { messageId, reactionEmoji, userId } = message
                setConversations(prev =>
                  prev.map(c =>
                    c.id === id
                      ? {
                          ...c,
                          messages: c.messages.map((m: any) =>
                            m.id === messageId ? { ...m, reactions: [...m.reactions, { userId, reactionEmoji }] } : m,
                          ),
                        }
                      : c,
                  ),
                )
              })
            })
          }
        } catch (error) {
          console.error("Error fetching conversations:", error)
        } finally {
          if (isMounted) {
            setNeedRefetchConversations(false)
          }
        }
      }
      init()
      return () => {
        isMounted = false
        const websocket = WebSocketService.getInstance()
        console.log("Unsubscribing from topics")
        conversations.forEach(c => {
          websocket.unsubscribe(TOPICS.CONVERSATION(c.id.toString()), () => {})
          websocket.unsubscribe(TOPICS.MESSAGE(c.id.toString()), () => {})
          websocket.unsubscribe(TOPICS.TYPING_STATUS(c.id.toString()), () => {})
          websocket.unsubscribe(TOPICS.SEEN_MESSAGE(c.id.toString()), () => {})
          websocket.unsubscribe(TOPICS.REACT_MESSAGE(c.id.toString()), () => {})
        })
      }
    }
  }
  useEffect(() => {
    fetchDataConversation()
  }, [])

  return (
    <>
      <div className="flex flex-row justify-between h-screen">
        <ChatList
          setSelectedChat={setSelectedChat}
          setIsGroupChat={setIsGroupChat}
          setConversationData={setConversationData}
          onPinChange={handlePinChangeSuccess}
          conversations={conversations}
          userId={userId}
          token={token}
        />
        {selectedChat ? (
          <ChatScreen
            conversationId={selectedChat}
            isChatInfoOpen={isChatInfoOpen}
            setIsChatInfoOpen={setIsChatInfoOpen}
            isGroupChat={isGroupChat}
            conversationData={conversationData}
            isChatSearchOpen={isChatSearchOpen}
            setIsChatSearchOpen={setIsChatSearchOpen}
            highlightMessageId={highlightMessageId}
            onRefetchConversations={handlePinChangeSuccess}
            userId={userId}
            token={token}
          />
        ) : (
          <>
            <Image
              src={Images.Background}
              alt="background-image"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </>
        )}

        {isChatSearchOpen && (
          <ChatSearch
            setIsOpen={setIsChatSearchOpen}
            conversationId={conversationData.id}
            setHighlightMessageId={setHighlightMessageId}
          />
        )}

        {isChatInfoOpen && selectedChat && (
          <ChatInfo
            isOpen={isChatInfoOpen}
            isGroupChat={isGroupChat}
            selectedChat={selectedChat}
            setIsChatInfoOpen={setIsChatInfoOpen}
            onPinChange={handlePinChangeSuccess}
            onHistoryDeleted={handleHistoryDeletedSuccess}
            onChatInfoUpdated={handleChatInfoUpdate}
          />
        )}
      </div>
    </>
  )
}
