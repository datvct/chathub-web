"use client"

import { useState, useRef, useEffect } from "react"
import { FaMicrophone, FaPaperclip, FaSmile, FaImage } from "react-icons/fa"
import { AiOutlineLike } from "react-icons/ai"
import { IoSend } from "react-icons/io5"
import EmojiPicker from "emoji-picker-react"
import { MessageType } from "~/types/types"
import { LiaFileVideo } from "react-icons/lia"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import Image from "next/image"

const ChatInput = ({ onSendMessage }: { onSendMessage: (msg: string, messageType: string) => void }) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const documentInputRef = useRef<HTMLInputElement | null>(null)
  const token = useSelector((state: RootState) => state.auth.token)
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  const handleLikeClick = () => {
    onSendMessage("👍", MessageType.TEXT)
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
  }

  const handleFileClick = (type: string, inputRef: React.RefObject<HTMLInputElement>) => {
    setFileType(type)
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFile = e.target.files[0]

    if (
      (fileType === MessageType.IMAGE && selectedFile.type.startsWith("image/")) ||
      (fileType === MessageType.VIDEO && selectedFile.type.startsWith("video/")) ||
      (fileType === MessageType.DOCUMENT &&
        (selectedFile.type.startsWith("application/") || selectedFile.type.startsWith("text/")))
    ) {
      setFile(selectedFile)
      setPreviewFile(URL.createObjectURL(selectedFile))
    } else {
      alert("Invalid file type. Please select a valid image, video, or document file.")
    }
  }

  const handleSendMessage = async () => {
    if (file) {
      try {
        const response = await fetch(
          `http://localhost:8080/aws/s3/presigned-url?fileName=${file.name}&contentType=${file.type}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) throw new Error("Failed to get presigned URL")

        const data = await response.json()

        const preSignedUrl = data.url
        const uploadResponse = await fetch(preSignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        const messageType = file.type.startsWith("image/")
          ? MessageType.IMAGE
          : file.type.startsWith("video/")
            ? MessageType.VIDEO
            : MessageType.DOCUMENT
        onSendMessage(uploadResponse.url.split("?")[0], messageType)
        setFile(null)
        setPreviewFile(null)
      } catch (error) {
        console.error("File upload error:", error)
        alert("Failed to upload file. Please try again.")
      }
    } else if (message.trim()) {
      onSendMessage(message, MessageType.TEXT)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 m-4 flex flex-col ">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-10 right-4 bg-[#2e2e3e] p-2 rounded-lg shadow-md">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {previewFile && (
        <div className="flex items-center space-x-2 bg-[#2e2e3e] p-2 rounded-lg">
          {fileType === MessageType.IMAGE && (
            <Image
              src={previewFile}
              alt="Preview"
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg object-cover"
            />
          )}
          {fileType === MessageType.VIDEO && (
            <video controls className="w-20 h-20 rounded-lg">
              <source src={previewFile} type={file?.type} />
              Your browser does not support the video tag.
            </video>
          )}
          {fileType === MessageType.DOCUMENT && <div className="text-white">📄 {file?.name}</div>}
          <button
            onClick={() => {
              setFile(null)
              setPreviewFile(null)
            }}
            className="text-red-500 text-lg"
          >
            ✖
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2.5">
        <div className="bg-[#2e2e3e] p-3 rounded-xl flex items-center space-x-3 w-[97%]">
          <button onClick={() => handleFileClick(MessageType.IMAGE, imageInputRef)}>
            <FaImage className="text-[#8A8A8A] text-xl" />
          </button>
          <button onClick={() => handleFileClick(MessageType.VIDEO, videoInputRef)}>
            <LiaFileVideo className="text-[#8A8A8A] text-xl" />
          </button>

          <button onClick={() => handleFileClick(MessageType.DOCUMENT, documentInputRef)} className="cursor-pointer">
            <FaPaperclip className="text-[#8A8A8A] text-xl" />
          </button>

          <input
            type="file"
            ref={imageInputRef}
            className="
          hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
          <input
            type="file"
            ref={documentInputRef}
            className="hidden"
            accept="application/*,text/*"
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button onClick={() => setShowEmojiPicker(prev => !prev)} className="cursor-pointer">
            <FaSmile className="text-[#8A8A8A] text-xl" />
          </button>

          {message.trim() || previewFile ? (
            <button onClick={handleSendMessage} className="cursor-pointer">
              <IoSend className="text-blue-500 text-xl" />
            </button>
          ) : (
            <button className="cursor-pointer">
              <AiOutlineLike className="text-[#8A8A8A] text-xl" onClick={handleLikeClick} />
            </button>
          )}
        </div>

        <button className="cursor-pointer bg-blue-500 p-3 rounded-xl">
          <FaMicrophone className="text-white text-xl" />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
