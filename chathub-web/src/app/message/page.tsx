"use client"

import { useState } from "react"
import useWebSocket from "~/hooks/useWebSocket"

const ChatComponent = () => {
  const { messages, sendMessage } = useWebSocket()
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("") // Xóa input sau khi gửi
    }
  }

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Chat WebSocket</h2>
      <div className="h-64 overflow-y-auto border p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Gửi
        </button>
      </div>
    </div>
  )
}

export default ChatComponent
