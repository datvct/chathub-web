import Image from "next/image"
import { MessageResponse } from "~/codegen/data-contracts"
import { Images } from "~/constants/images"
import { formatDisplayDate, formatTimeSendAt, getFileName } from "~/lib/utils"
import { isOnlyEmoji } from "~/lib/emojiUtils" // Hàm kiểm tra tin nhắn chỉ có emoji
import { MessageType } from "~/types/types"
import Link from "next/link"
import { IoIosDocument } from "react-icons/io"
import moment from "moment"

interface ChatMessageProps {
  messages: MessageResponse[]
  userId: number
  isGroupChat: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const ChatMessage = ({ messages, userId, isGroupChat, messagesEndRef }: ChatMessageProps) => {
  let lastMessageDate: string | null = null

  return (
    <div className="flex flex-col space-y-3" key={messages[0]?.id}>
      {messages
        .slice()
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
        .map(msg => {
          const currentMessageDate = moment(msg.sentAt).format("YYYY-MM-DD")
          const isNewDate = currentMessageDate !== lastMessageDate
          lastMessageDate = currentMessageDate
          return (
            <div key={msg.id}>
              {isNewDate && (
                <div className="text-center text-xs text-white my-2">{formatDisplayDate(currentMessageDate)}</div>
              )}
              <div
                id={`message-${msg.id}`}
                className={`message flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                {msg.senderId !== userId && (
                  <Image
                    src={Images.AvatarDefault}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="w-8 h-8 mr-2 rounded-[20px] mt-4"
                  />
                )}
                <div>
                  {isGroupChat && msg.senderId !== userId && (
                    <span className="text-xs text-white">{msg.senderName}</span>
                  )}
                  {msg.messageType === MessageType.IMAGE ? (
                    <>
                      <Image
                        src={msg.content ?? Images.ImageDefault}
                        alt="sent"
                        className="rounded-lg w-40"
                        width={150}
                        height={150}
                      />
                      <span className="text-[10px] text-white block mt-1">{formatTimeSendAt(msg.sentAt)}</span>
                    </>
                  ) : msg.messageType === MessageType.LINK ? (
                    <>
                      <Link href={msg.content} target="_blank" rel="noopener noreferrer" className="text-[#1566A3]">
                        <p className="p-3 rounded-lg w-max max-w-xs break-words whitespace-pre-wrap bg-[#F0F0F0] ">
                          <span className="hover:underline">{msg.content}</span>
                          <span className="text-[10px] text-black block mt-1">{formatTimeSendAt(msg.sentAt)}</span>
                        </p>
                      </Link>
                    </>
                  ) : msg.messageType === MessageType.DOCUMENT ? (
                    <Link href={msg.content} target="_blank" rel="noopener noreferrer" className="text-[#1566A3]">
                      <div className="p-3 rounded-lg w-max max-w-xs break-words whitespace-pre-wrap bg-[#F0F0F0]">
                        <span>
                          <span className="hover:underline flex flex-row items-center">
                            <IoIosDocument size={25} color="#1566A3" />

                            {getFileName(msg.content)}
                          </span>
                        </span>
                      </div>
                      <span className="text-[10px] text-white block mt-1">{formatTimeSendAt(msg.sentAt)}</span>
                    </Link>
                  ) : msg.messageType === MessageType.VIDEO ? (
                    <video controls className="rounded-lg w-40">
                      <source src={msg.content} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p
                      className={`p-3 rounded-lg w-max max-w-xs break-words text-black whitespace-pre-wrap ${
                        msg.senderId === userId ? "bg-[#1566A3] text-white" : "bg-[#F0F0F0]"
                      } ${isOnlyEmoji(msg.content) ? "text-4xl p-2 bg-transparent" : ""}`}
                    >
                      {msg.content}
                      <span className={`text-xs block mt-1 ${msg.senderId === userId ? "text-white" : "text-black"}`}>
                        {formatTimeSendAt(msg.sentAt)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessage
