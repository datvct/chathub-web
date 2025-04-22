import Image from "next/image"
import { MessageResponse } from "~/codegen/data-contracts"
import { Images } from "~/constants/images"
import { formatDisplayDate, formatTimeSendAt, getFileName } from "~/lib/utils"
import { isOnlyEmoji } from "~/lib/emojiUtils"
import { MessageType } from "~/types/types"
import Link from "next/link"
import { IoIosDocument } from "react-icons/io"
import moment from "moment"
import { CiMenuKebab, CiFaceSmile } from "react-icons/ci"
import { TiArrowBackOutline, TiArrowForwardOutline } from "react-icons/ti"
import { useEffect, useState } from "react"
import { unsendMessage, deleteMessage, forwardMessage } from "~/lib/get-message"
import ForwardMessageModal from "./modal/modal-forward-message"
import { IoReturnUpForward } from "react-icons/io5"

interface ChatMessageProps {
  messages: MessageResponse[]
  userId: number
  isGroupChat: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  token: string
  refetchMessages: () => void
  onImageClick: (imageUrl: string) => void
}

const ChatMessage = ({
  messages,
  userId,
  isGroupChat,
  messagesEndRef,
  token,
  refetchMessages,
  onImageClick,
}: ChatMessageProps) => {
  let lastMessageDate: string | null = null
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [forwardingMessage, setForwardingMessage] = useState<MessageResponse | null>(null)
  const [isFriendListModalOpen, setIsFriendListModalOpen] = useState(false)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleUnsend = async (messageId: number) => {
    const res = await unsendMessage(userId, messageId, token)
    setOpenMenuId(null)
  }

  const handleDelete = async (messageId: number) => {
    const res = await deleteMessage(userId, messageId, token)
    if (res) {
      refetchMessages()
      setForwardingMessage(null)
    }
  }

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
                className={`message items-center gap-2 ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                } ${msg.userDeleted == true && userId === msg.deletedByUserId ? "hidden" : "flex"}`}
              >
                {msg.senderId === userId && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 relative">
                      <div
                        className={`absolute right-16 bottom-1 w-[200px] bg-[#252728] pl-3 pr-5 py-3 rounded-lg shadow-md ${openMenuId === msg.id ? "block" : "hidden"}`}
                      >
                        <ul>
                          {msg.unsent === false && (
                            <li
                              className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer"
                              onClick={() => handleUnsend(msg.id)}
                            >
                              Unsend
                            </li>
                          )}
                          <li
                            className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer"
                            onClick={() => handleDelete(msg.id)}
                          >
                            Delete For Me Only
                          </li>
                          {msg.unsent === false && msg.content != '" have forward this message"' && (
                            <li
                              className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer"
                              onClick={() => {
                                setForwardingMessage(msg)
                                setIsFriendListModalOpen(true)
                                setOpenMenuId(null)
                              }}
                            >
                              Forward
                            </li>
                          )}
                        </ul>
                      </div>
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full realative"
                        onClick={() => {
                          setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                        }}
                      >
                        <CiMenuKebab />
                      </button>
                    </div>
                    {msg.unsent === false && msg.content != '" have forward this message"' && (
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full"
                        onClick={() => {
                          setForwardingMessage(msg)
                          setIsFriendListModalOpen(true)
                          setOpenMenuId(null)
                        }}
                      >
                        <TiArrowBackOutline />
                      </button>
                    )}
                    {msg.unsent === false && (
                      <button className="hover:bg-[#333334] p-2 rounded-full">
                        <CiFaceSmile />
                      </button>
                    )}
                  </div>
                )}
                {msg.senderId !== userId && (
                  <Image
                    src={msg.avatar || Images.AvatarDefault}
                    width={32}
                    height={32}
                    alt={msg.senderName || "Avatar"}
                    className="w-8 h-8 mr-2 rounded-[20px] mt-4"
                  />
                )}
                <div>
                  {isGroupChat && msg.senderId !== userId && (
                    <span className="text-xs text-white">{msg.senderName}</span>
                  )}

                  {msg.unsent === true ? (
                    <p
                      className={`p-3 rounded-lg w-max max-w-xs break-words text-black whitespace-pre-wrap ${
                        msg.senderId === userId ? "bg-[#1566A3] text-white" : "bg-[#F0F0F0]"
                      }`}
                    >
                      You unsent a message
                      <span className={`text-xs block mt-1 ${msg.senderId === userId ? "text-white" : "text-black"}`}>
                        {formatTimeSendAt(msg.sentAt)}
                      </span>
                    </p>
                  ) : msg.messageType === MessageType.IMAGE ? (
                    (() => {
                      const images = msg.content?.split(",") || []
                      const gridCols =
                        images.length === 1
                          ? "grid-cols-1"
                          : images.length === 2
                            ? "grid-cols-2"
                            : images.length === 3
                              ? "grid-cols-3"
                              : "grid-cols-2 sm:grid-cols-3"

                      return (
                        <div className={`grid ${gridCols} gap-2 max-w-xs`}>
                          {images.map((imgUrl, index) => (
                            <button
                              key={index}
                              onClick={() => onImageClick(imgUrl)}
                              className="relative overflow-hidden rounded-lg cursor-pointer group"
                            >
                              <Image
                                src={imgUrl}
                                alt={`Sent image ${index + 1}`}
                                className="rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                                width={160}
                                height={160}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200"></div>
                              {index === 0 && (
                                <span className="text-[10px] text-white block mt-1 absolute bottom-1 right-1 bg-black bg-opacity-50 px-1 rounded">
                                  {formatTimeSendAt(msg.sentAt)}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )
                    })()
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
                    <div
                      className={`p-3 rounded-lg w-max max-w-xs break-words text-black whitespace-pre-wrap ${
                        msg.senderId === userId ? "bg-[#1566A3] text-white" : "bg-[#F0F0F0]"
                      } ${isOnlyEmoji(msg.content) && msg.content?.trim() && msg.unsent === false ? "text-4xl p-2 bg-transparent" : ""}`}
                    >
                      {(msg.content?.trim() && msg.forwarded === false) ||
                      (msg.content != '" have forward this message"' && msg.forwarded === true)
                        ? msg.content.replace(/^"(.*)"$/, "$1")
                        : ""}
                      {msg.forwarded === true && (
                        <div
                          className={`flex flex-col mt-1 p-2 border-l-4 ${
                            msg.senderId === userId ? "bg-[#0000004d] text-[#9facbc] border-[#66a6ff]" : "bg-[#fff]"
                          }`}
                        >
                          <div className="flex gap-1 items-center">
                            <IoReturnUpForward />
                            <img src={msg.avatar} alt="" className="rounded-full w-[20px]" />
                            <p>{msg.senderName}</p>
                          </div>
                          <div className="pt-2">
                            {msg.forwardedMessage.messageType === MessageType.IMAGE ? (
                              (() => {
                                const images = msg.forwardedMessage.originalContentSnapshot?.split(",") || []
                                const gridCols =
                                  images.length === 1
                                    ? "grid-cols-1"
                                    : images.length === 2
                                      ? "grid-cols-2"
                                      : images.length === 3
                                        ? "grid-cols-3"
                                        : "grid-cols-2 sm:grid-cols-3"

                                return (
                                  <div className={`grid ${gridCols} gap-2 max-w-xs`}>
                                    {images.map((imgUrl, index) => (
                                      <button
                                        key={index}
                                        onClick={() => onImageClick(imgUrl)}
                                        className="relative overflow-hidden rounded-lg cursor-pointer group"
                                      >
                                        <Image
                                          src={imgUrl}
                                          alt={`Sent image ${index + 1}`}
                                          className="rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                                          width={160}
                                          height={160}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200"></div>
                                        {index === 0 && (
                                          <span className="text-[10px] text-white block mt-1 absolute bottom-1 right-1 bg-black bg-opacity-50 px-1 rounded">
                                            {formatTimeSendAt(msg.sentAt)}
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )
                              })()
                            ) : msg.forwardedMessage.messageType === MessageType.LINK ? (
                              <>
                                <Link
                                  href={msg.forwardedMessage.originalContentSnapshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1566A3]"
                                >
                                  <p className="p-3 rounded-lg break-words whitespace-pre-wrap bg-[#F0F0F0] ">
                                    <span className="hover:underline">
                                      {msg.forwardedMessage.originalContentSnapshot}
                                    </span>
                                    <span className="text-[10px] text-black block mt-1">
                                      {formatTimeSendAt(msg.sentAt)}
                                    </span>
                                  </p>
                                </Link>
                              </>
                            ) : msg.forwardedMessage.messageType === MessageType.DOCUMENT ? (
                              <Link
                                href={msg.forwardedMessage.originalContentSnapshot}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1566A3]"
                              >
                                <div className="p-3 rounded-lg break-words whitespace-pre-wrap bg-[#F0F0F0]">
                                  <span>
                                    <span className="hover:underline flex flex-row items-center flex-wrap">
                                      <IoIosDocument size={25} color="#1566A3" />
                                      <span className="whitespace-pre-wrap w-[80%]">
                                        {getFileName(msg.forwardedMessage.originalContentSnapshot)}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                                <span className="text-[10px] text-white block mt-1">
                                  {formatTimeSendAt(msg.sentAt)}
                                </span>
                              </Link>
                            ) : msg.forwardedMessage.messageType === MessageType.VIDEO ? (
                              <video controls className="rounded-lg w-40">
                                <source src={msg.content} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      )}
                      <span className={`text-xs block mt-1 ${msg.senderId === userId ? "text-white" : "text-black"}`}>
                        {formatTimeSendAt(msg.sentAt)}
                      </span>
                    </div>
                  )}
                </div>
                {msg.senderId != userId && (
                  <div className="flex items-center gap-2">
                    <button className="hover:bg-[#333334] p-2 rounded-full">
                      <CiFaceSmile />
                    </button>
                    {msg.unsent === false && msg.content != '" have forward this message"' && (
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full"
                        onClick={() => {
                          setForwardingMessage(msg)
                          setIsFriendListModalOpen(true)
                          setOpenMenuId(null)
                        }}
                      >
                        <TiArrowForwardOutline />
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        className="hover:bg-[#333334] p-2 rounded-full realative"
                        onClick={() => {
                          setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                        }}
                      >
                        <CiMenuKebab />
                      </button>
                      <div
                        className={`bg-[#252728] pl-3 pr-5 py-3 rounded-lg shadow-md ${
                          openMenuId === msg.id ? "block" : "hidden"
                        }`}
                      >
                        <ul>
                          <li
                            className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer"
                            onClick={() => handleDelete(msg.id)}
                          >
                            Delete For Me Only
                          </li>
                          {msg.unsent === false && msg.content != '" have forward this message"' && (
                            <li
                              className="hover:bg-[#333334] p-2 pr-3 rounded cursor-pointer"
                              onClick={() => {
                                setForwardingMessage(msg)
                                setIsFriendListModalOpen(true)
                                setOpenMenuId(null)
                              }}
                            >
                              Forward
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      <ForwardMessageModal
        isOpen={isFriendListModalOpen}
        onClose={() => {
          setIsFriendListModalOpen(false)
          setForwardingMessage(null)
        }}
        token={token}
        message={forwardingMessage}
        userId={userId}
      />
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessage
