"use client"

import { useState, useRef, useEffect } from "react"
import { FaPaperclip, FaSmile, FaImage } from "react-icons/fa"
import { AiOutlineLike } from "react-icons/ai"
import { IoSend } from "react-icons/io5"
import EmojiPicker from "emoji-picker-react"
import { MediaType, MessageType } from "~/types/types"
import { LiaFileVideo } from "react-icons/lia"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import Image from "next/image"

const ChatInput = ({
  onSendMessage,
  onSendFileAndText,
}: {
  onSendMessage: (msg: string, messageType: string) => void
  onSendFileAndText: (msg: string, messageType: string, fileName: string, filePath: string) => void
}) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileType, setFileType] = useState<string | null>(null)
  const [previewFiles, setPreviewFiles] = useState<string[]>([])
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const documentInputRef = useRef<HTMLInputElement | null>(null)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return
      const items = e.clipboardData.items
      const newFiles: File[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile()
          if (file) newFiles.push(file)
        }
      }

      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles])
        setPreviewFiles(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))])
        setFileType(MessageType.IMAGE)
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [])

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
  }

  const handleLikeClick = () => {
    onSendMessage("👍", MessageType.TEXT)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
      setShowEmojiPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFileClick = (type: string, inputRef: React.RefObject<HTMLInputElement>) => {
    setFileType(type)
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFiles = Array.from(e.target.files)
    e.target.value = ""

    if (fileType === MessageType.IMAGE) {
      setFiles(prev => [...prev, ...selectedFiles])
      setPreviewFiles(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))])
    } else {
      const selectedFile = selectedFiles[0]
      if (
        (fileType === MessageType.VIDEO && selectedFile.type.startsWith("video/")) ||
        (fileType === MessageType.DOCUMENT &&
          (selectedFile.type.startsWith("application/") || selectedFile.type.startsWith("text/")))
      ) {
        setFiles([selectedFile])
        setPreviewFiles([URL.createObjectURL(selectedFile)])
      } else {
        alert("Invalid file type. Please select a valid file.")
      }
    }
  }

  const handleSendMessage = async () => {
    const isGenerateImageCommand = message.trim().startsWith("@image ")

    if (isGenerateImageCommand) {
      const description = message.trim().substring(7).trim() // Lấy phần mô tả
      onSendMessage(message.trim().trim(), MessageType.TEXT)

      if (description) {
        try {
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${process.env.API_KEY_GEMINI}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: description }],
                  },
                ],
                generationConfig: {
                  responseModalities: ["TEXT", "IMAGE"],
                },
              }),
            },
          )

          if (!geminiResponse.ok) onSendMessage("Failed to generate image from Gemini", MessageType.TEXT)

          const geminiJson = await geminiResponse.json()

          const imagePart = geminiJson?.candidates?.[0]?.content?.parts?.find(
            (part: { inlineData: { mimeType: string } }) =>
              part.inlineData && part.inlineData.mimeType.startsWith("image/"),
          )

          if (!imagePart) throw new Error("No image data returned from Gemini")

          const base64Image = imagePart.inlineData.data
          const mimeType = imagePart.inlineData.mimeType || "image/png"
          const fileName = `gemini-image-${Date.now()}.png`

          const blob = await fetch(`data:${mimeType};base64,${base64Image}`).then(res => res.blob())
          const file = new File([blob], fileName, { type: mimeType })

          // Lấy presigned URL từ server
          const response = await fetch(
            `${process.env.API_URL}/aws/s3/presigned-url?fileName=${file.name}&contentType=${file.type}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (!response.ok) throw new Error("Failed to get presigned URL")

          const data = await response.json()

          // Upload ảnh lên S3
          await fetch(data.url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          })

          const imageUrl = data.url.split("?")[0]

          // Gửi tin nhắn
          onSendMessage(imageUrl, MessageType.IMAGE)
          setMessage("")
          return
        } catch (err) {
          console.error(err)
          alert("Failed to generate or send AI image.")
          return
        }
      }
    }

    const isGenerateTextCommand = message.trim().startsWith("@text ")

    if (isGenerateTextCommand) {
      const prompt = message.trim().substring(6).trim() // Lấy nội dung sau @text
      onSendMessage(message.trim().trim(), MessageType.TEXT)

      if (prompt) {
        try {
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY_GEMINI}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
              }),
            },
          )

          if (!geminiResponse.ok) onSendMessage("Failed to generate text from Gemini", MessageType.TEXT)

          const geminiData = await geminiResponse.json()
          const textResponse = geminiData?.candidates?.[0]?.content?.parts?.find((p: { text: any }) => p.text)?.text

          if (!textResponse) throw new Error("No text returned")

          const cleanedText = textResponse
            .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold markdown
            .replace(/\* /g, "- ") // replace * with -
            .trim()

          const safeText = cleanedText.replace(/\n+/g, " | ")

          onSendMessage(safeText, MessageType.TEXT) // Gửi trả lời dạng text
          setMessage("")
          return
        } catch (err) {
          console.error(err)
          alert("Failed to generate AI reply.")
          return
        }
      }
    }
    if (files.length > 0) {
      if (fileType === MessageType.IMAGE) {
        // ✅ Xử lý nhiều ảnh
        const uploadedUrls: string[] = []

        for (const file of files) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/aws/s3/presigned-url?fileName=${file.name}&contentType=${file.type}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (!response.ok) throw new Error("Failed to get presigned URL")

            const data = await response.json()
            await fetch(data.url, {
              method: "PUT",
              body: file,
              headers: { "Content-Type": file.type },
            })

            uploadedUrls.push(data.url.split("?")[0])
          } catch (err) {
            alert("Upload failed for some images.")
          }
        }

        if (uploadedUrls.length > 0) {
          const combinedUrlString = uploadedUrls.join(",")
          const file = files[0]

          // Nếu có nội dung text kèm theo => gửi text nữa
          if (message.trim()) {
            onSendFileAndText(message, MediaType.IMAGE, file.name, uploadedUrls[0])
            setFiles([])
            setPreviewFiles([])
            setFileType(null)
            setMessage("")
          } else {
            onSendMessage(combinedUrlString, MessageType.IMAGE)
          }
        }
      } else {
        // ✅ Xử lý video hoặc document: chỉ 1 file
        const file = files[0]
        try {
          const response = await fetch(
            `${process.env.API_URL}/aws/s3/presigned-url?fileName=${file.name}&contentType=${file.type}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (!response.ok) throw new Error("Failed to get presigned URL")

          const data = await response.json()
          await fetch(data.url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          })

          const type = file.type.startsWith("video/") ? MessageType.VIDEO : MessageType.DOCUMENT

          if (message.trim()) {
            onSendFileAndText(message, type, file.name, data.url.split("?")[0])
            setFiles([])
            setPreviewFiles([])
            setFileType(null)
            setMessage("")
          } else {
            onSendMessage(data.url.split("?")[0], type)
          }
        } catch (err) {
          alert("Upload failed for the file.")
        }
      }

      // ✅ Reset lại
      setFiles([])
      setPreviewFiles([])
      setFileType(null)
    } else if (message.trim()) {
      const isLink = /^(https?:\/\/[^\s]+)$/.test(message.trim())
      const messageType = isLink ? MessageType.LINK : MessageType.TEXT
      onSendMessage(message, messageType)
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
    <div className="absolute bottom-0 left-0 right-0 m-4 flex flex-col">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-10 right-4 bg-[#2e2e3e] p-2 rounded-lg shadow-md">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <div className="bg-[#2e2e3e] p-4 rounded-lg shadow-md flex flex-col space-y-2 mx-5">
        {previewFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 bg-[#2e2e3e] p-2 rounded-lg">
            {fileType === MessageType.IMAGE &&
              previewFiles.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="Preview"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ))}
            {fileType === MessageType.VIDEO && (
              <video controls className="w-20 h-20 rounded-lg">
                <source src={previewFiles[0]} type={files[0]?.type} />
              </video>
            )}
            {fileType === MessageType.DOCUMENT && <div className="text-white">📄 {files[0]?.name}</div>}
            <button
              onClick={() => {
                setFiles([])
                setPreviewFiles([])
                imageInputRef.current!.value = ""
                videoInputRef.current!.value = ""
                documentInputRef.current!.value = ""
              }}
              className="text-red-500 text-lg"
            >
              ✖
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button onClick={() => handleFileClick(MessageType.IMAGE, imageInputRef)}>
            <FaImage className="text-[#8A8A8A] text-xl" />
          </button>
          <button onClick={() => handleFileClick(MessageType.VIDEO, videoInputRef)}>
            <LiaFileVideo className="text-[#8A8A8A] text-xl" />
          </button>
          <button onClick={() => handleFileClick(MessageType.DOCUMENT, documentInputRef)}>
            <FaPaperclip className="text-[#8A8A8A] text-xl" />
          </button>

          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            multiple
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

          <button onClick={() => setShowEmojiPicker(prev => !prev)}>
            <FaSmile className="text-[#8A8A8A] text-xl" />
          </button>

          {message.trim() || previewFiles.length > 0 ? (
            <button onClick={handleSendMessage}>
              <IoSend className="text-blue-500 text-xl" />
            </button>
          ) : (
            <button onClick={handleLikeClick}>
              <AiOutlineLike className="text-[#8A8A8A] text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput
