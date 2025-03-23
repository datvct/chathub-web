import Image from "next/image"
import { MessageResponse } from "~/codegen/data-contracts"
import { Images } from "~/constants/images"
import { formatRelativeTime } from "~/lib/utils"
import { isOnlyEmoji } from "~/lib/emojiUtils" // Hàm kiểm tra tin nhắn chỉ có emoji

interface ChatMessageProps {
  messages: MessageResponse[]
  userId: number
  isGroupChat: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const ChatMessage = ({ messages, userId, isGroupChat, messagesEndRef }: ChatMessageProps) => {
  return (
    <div className="flex flex-col space-y-3">
      {messages
        .slice()
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
        .map(msg => (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className={`message flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId !== userId && (
              <Image
                src={Images.AvatarDefault}
                width={32}
                height={32}
                alt="avatar"
                className="w-8 h-8 mr-2 rounded-[20px]"
              />
            )}
            <div>
              {isGroupChat && msg.senderId !== userId && (
                <span className="text-xs text-gray-400">{msg.senderName}</span>
              )}
              {msg.messageType === "IMAGE" ? (
                <>
                  <Image
                    src={msg.content ?? Images.ImageDefault}
                    alt="sent"
                    className="rounded-lg w-40"
                    width={150}
                    height={150}
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">{formatRelativeTime(msg.sentAt)}</span>
                </>
              ) : (
                <p
                  className={`p-3 rounded-lg w-max max-w-xs break-words whitespace-pre-wrap ${
                    msg.senderId === userId ? "bg-[#1566A3]" : "bg-[#484848]"
                  } ${isOnlyEmoji(msg.content) ? "text-4xl p-2 bg-transparent" : ""}`}
                >
                  {msg.content}
                  <span className="text-xs text-gray-400 block mt-1">{formatRelativeTime(msg.sentAt)}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessage
