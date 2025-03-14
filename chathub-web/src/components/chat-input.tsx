"use client"

import { useState, useRef, useEffect } from "react"
import { FaMicrophone, FaPaperclip, FaSmile } from "react-icons/fa"
import { AiOutlineLike } from "react-icons/ai"
import { IoSend } from "react-icons/io5"
import EmojiPicker from "emoji-picker-react"
import { MessageType } from "~/types/types"

const ChatInput = ({ onSendMessage }: { onSendMessage: (msg: string, messageType: string) => void }) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [emoji, setEmoji] = useState<string | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setEmoji(emojiObject.emoji)
    setMessage(prev => prev + emojiObject.emoji)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message, "TEXT")
      setMessage("")
      setEmoji(null)
    } else if (emoji) {
      onSendMessage(emoji, MessageType.EMOJI)
      setEmoji(null)
    } else if (file) {
      const fileType = file.type.startsWith("image/")
        ? MessageType.IMAGE
        : file.type.startsWith("video/")
        ? MessageType.VIDEO
        : file.type.startsWith("application/pdf")
        ? MessageType.DOCUMENT
        : MessageType.TEXT
      onSendMessage(URL.createObjectURL(file), fileType)
      setFile(null)
    }
  }

  // Handle clicking the like button
  const handleLikeClick = () => {
    onSendMessage("👍", MessageType.EMOJI)
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 m-4 flex flex-col gap-2.5">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-10 right-4 bg-[#2e2e3e] p-2 rounded-lg shadow-md">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-center justify-between gap-2.5">
        <div className="bg-[#2e2e3e] p-3 rounded-xl flex items-center space-x-3 w-[97%]">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <FaPaperclip className="text-[#8A8A8A] text-xl cursor-pointer" onClick={handleFileClick} />

          <input
            type="text"
            placeholder="Write a message..."
            className="w-full bg-transparent text-white focus:outline-none"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
          />
          <FaSmile
            className="text-[#8A8A8A] text-xl cursor-pointer"
            onClick={() => setShowEmojiPicker(prev => !prev)}
          />
          <FaMicrophone className="text-[#8A8A8A] text-xl" />
        </div>
        <div className="cursor-pointer" onClick={handleSendMessage}>
          {message.trim() === "" && !emoji ? (
            <AiOutlineLike size={40} onClick={handleLikeClick} />
          ) : (
            <IoSend size={30} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput
