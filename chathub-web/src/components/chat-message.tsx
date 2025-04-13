import Image from "next/image"
import { MessageResponse } from "~/codegen/data-contracts"
import { Images } from "~/constants/images"
import { formatDisplayDate, formatTimeSendAt, getFileName } from "~/lib/utils"
import { isOnlyEmoji } from "~/lib/emojiUtils" // Hàm kiểm tra tin nhắn chỉ có emoji
import { MessageType } from "~/types/types"
import Link from "next/link"
import { IoIosDocument } from "react-icons/io"
import moment from "moment"
import { CiMenuKebab, CiFaceSmile } from "react-icons/ci"
import { TiArrowBackOutline, TiArrowForwardOutline } from "react-icons/ti"
import { useState } from "react"
import {unsendMessage, deleteMessage, forwardMessage} from "~/lib/get-message"

interface ChatMessageProps {
  messages: MessageResponse[]
  userId: number
  isGroupChat: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  token: string
  refetchMessages: () => void
}

const ChatMessage = ({ messages, userId, isGroupChat, messagesEndRef, token, refetchMessages }: ChatMessageProps) => {
  let lastMessageDate: string | null = null
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const handleUnsend = async (messageId: number) => {
    const res = await unsendMessage(userId, messageId, token)
    setOpenMenuId(null)
  }
  
  const handleDelete = async (messageId: number) => {
    const res = await deleteMessage(userId, messageId, token)
    if(res) {
      refetchMessages()
    }
  }
  
  // const handleForward = async (messageId: number) => {
  //   const conversationIds = [/* ví dụ: 123, 456 */] // Tuỳ vào cách bạn chọn hội thoại để forward
  //   const res = await forwardMessage(userId, messageId, conversationIds, localStorage.getItem("token") ?? "")
  //   console.log(res)
  // }  

  return (
    <div className="flex flex-col space-y-3 key={messages[0]?.id}">
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
                className={`message items-center gap-2 h-[141px] ${msg.senderId === userId ? "justify-end" : "justify-start"} ${msg.userDeleted==true ? "hidden" : "flex"}`}
              >
                {msg.senderId === userId && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`bg-[#252728] pl-3 pr-5 py-3 rounded-lg shadow-md ${openMenuId === msg.id ? "block" : "hidden"}`}
                      >
                        <ul>
                          {msg.unsent === false && <li className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer" onClick={() => handleUnsend(msg.id)}>Recall</li>}
                          <li className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer" onClick={() => handleDelete(msg.id)}>Delete Message</li>
                          {msg.unsent === false && <li className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer">Forward</li>}
                        </ul>
                      </div>
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full realative"
                        onClick={() => {setOpenMenuId(openMenuId === msg.id ? null : msg.id);}}
                      >
                        <CiMenuKebab />
                      </button>
                    </div>
                    <button className="hover:bg-[#333334] p-2 rounded-full">
                      <TiArrowBackOutline />
                    </button>
                    <button className="hover:bg-[#333334] p-2 rounded-full">
                      <CiFaceSmile />
                    </button>
                  </div>
                )}
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
                  ) : msg.unsent === true ? (
                    <p
                      className={`p-3 rounded-lg w-max max-w-xs break-words text-black whitespace-pre-wrap ${
                        msg.senderId === userId ? "bg-[#1566A3] text-white" : "bg-[#F0F0F0]"
                      } ${isOnlyEmoji(msg.content) ? "text-4xl p-2 bg-transparent" : ""}`}
                    >
                      Message recalled
                      <span className={`text-xs block mt-1 ${msg.senderId === userId ? "text-white" : "text-black"}`}>
                        {formatTimeSendAt(msg.sentAt)}
                      </span>
                    </p>
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
                {msg.senderId != userId && (
                  <div className="flex items-center gap-2">
                    <button className="hover:bg-[#333334] p-2 rounded-full">
                      <CiFaceSmile />
                    </button>
                    <button className="hover:bg-[#333334] p-2 rounded-full">
                      <TiArrowForwardOutline />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full realative"
                        onClick={() => {setOpenMenuId(openMenuId === msg.id ? null : msg.id)}}
                      >
                        <CiMenuKebab />
                      </button>
                      <div
                        className={`bg-[#252728] pl-3 pr-5 py-3 rounded-lg shadow-md ${openMenuId === msg.id ? "block" : "hidden"}`}
                      >
                        <ul>
                          <li className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer" onClick={() => handleDelete(msg.id)}>Delete Message</li>
                          {msg.unsent === false && <li className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer">Forward</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessage
