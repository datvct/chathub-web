"use client"
import { useState, useRef, useEffect } from "react"
import { FaMicrophone, FaPaperclip, FaSmile } from "react-icons/fa"
import { AiOutlineLike } from "react-icons/ai"
import { IoSend } from "react-icons/io5"
import EmojiPicker from "emoji-picker-react"

const ChatInput = () => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Xử lý chọn emoji
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji) // Thêm emoji vào input
  }

  // Ẩn Emoji Picker khi click ra ngoài
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

  return (
    <div className="absolute bottom-0 left-0 right-0 m-4 flex flex-col gap-2.5">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-10 right-4 bg-[#2e2e3e] p-2 rounded-lg shadow-md">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-center justify-between gap-2.5">
        <div className="bg-[#2e2e3e] p-3 rounded-xl flex items-center space-x-3 w-[97%]">
          <input type="file" ref={fileInputRef} className="hidden" />

          <FaPaperclip className="text-[#8A8A8A] text-xl cursor-pointer" onClick={handleFileClick} />
          <input
            type="text"
            placeholder="Write a message..."
            className="w-full bg-transparent text-white focus:outline-none"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <FaSmile
            className="text-[#8A8A8A] text-xl cursor-pointer"
            onClick={() => setShowEmojiPicker(prev => !prev)}
          />
          <FaMicrophone className="text-[#8A8A8A] text-xl" />
        </div>
        <div className="cursor-pointer">
          {message.trim() === "" ? <AiOutlineLike size={40} /> : <IoSend size={30} />}
        </div>
      </div>
    </div>
  )
}

export default ChatInput
