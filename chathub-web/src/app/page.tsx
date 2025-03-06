"use client"

import { useEffect, useState, useCallback } from "react"
import { useSelector } from "react-redux";
import { RootState } from "~/lib/reudx/store";
import { useConversation } from "~/hooks/use-converstation";
import ChatList from "../components/chat-list"
import ChatScreen from "~/components/chat-area"
import Image from "next/image"
import { Images } from "../constants/images"
import ChatInfo from "~/components/chat-info"
import { ToastContainer } from "react-toastify"
import { ConversationResponse } from "~/codegen/data-contracts"
import ChatSearch from "~/components/chat-search"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [conversationData, setConversationData] = useState<ConversationResponse | null>(null)
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false)
  const [highlightMessageId, setHighlightMessageId] = useState<number | null>(null)
  const [needRefetchConversations, setNeedRefetchConversations] = useState(false)

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const handlePinChangeSuccess = useCallback(() => { // Callback function
    setNeedRefetchConversations(prevState => !prevState); // Toggle state to trigger useEffect in ChatList
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false);
      setIsChatSearchOpen(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      setIsChatInfoOpen(false)
      setIsChatSearchOpen(false)
    }
  }, [selectedChat])

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} closeOnClick />
      <div className="flex flex-row justify-between h-screen">
        <ChatList
          setSelectedChat={setSelectedChat}
          setIsGroupChat={setIsGroupChat}
          setConversationData={setConversationData}
        // conversations={conversationsList}
        />
        {selectedChat ? (
          <ChatScreen
            selectedChatId={selectedChat}
            isChatInfoOpen={isChatInfoOpen}
            setIsChatInfoOpen={setIsChatInfoOpen}
            isGroupChat={isGroupChat}
            conversationData={conversationData}
            isChatSearchOpen={isChatSearchOpen}
            setIsChatSearchOpen={setIsChatSearchOpen}
            highlightMessageId={highlightMessageId}
          // onRefetchConversations={handleRefetchConversationsList}
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
        {isChatInfoOpen &&
          <ChatInfo
            isOpen={isChatInfoOpen}
            isGroupChat={isGroupChat}
            selectedChat={selectedChat}
            setIsChatInfoOpen={setIsChatInfoOpen}
            onPinChange={handlePinChangeSuccess}
          />
        }
      </div>
    </>
  )
}
