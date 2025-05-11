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
import { unsendMessage, deleteMessage, forwardMessage, reactToMessage } from "~/lib/get-message"
import ForwardMessageModal from "./modal/modal-forward-message"
import { IoReturnUpForward } from "react-icons/io5"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Modal } from "@mui/material"

interface ChatMessageProps {
  messages: MessageResponse[]
  userId: number
  conversationId: number
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
  conversationId,
}: ChatMessageProps) => {
  let lastMessageDate: string | null = null
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [forwardingMessage, setForwardingMessage] = useState<MessageResponse | null>(null)
  const [isFriendListModalOpen, setIsFriendListModalOpen] = useState(false)
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"]
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<MessageResponse>(null)
  const handleOpen = message => {
    setSelectedMessage(message)
    setOpenModal(true)
    console.log()
  }
  const handleClose = () => setOpenModal(false)

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

  const handleReact = async (emoji: string, messageId: number) => {
    const success = await reactToMessage(
      {
        conversationId,
        messageId,
        userId,
        reactionEmoji: emoji,
      },
      token,
    )

    if (success) {
      setOpen(false)
    } else {
      console.error("Failed to react with:", emoji)
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="hover:bg-[#333334] p-2 rounded-full" onClick={() => setOpen(!open)}>
                            <CiFaceSmile size={20} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          sideOffset={8}
                          className={`bg-[#252728] border-0 rounded-3xl py-2 justify-center ${open === true ? "flex" : "hidden"}`}
                        >
                          <div className="flex items-center space-x-2 w-full justify-between px-5">
                            {emojis.map((emoji, index) => (
                              <button
                                key={index}
                                className="text-xl hover:scale-125 transition-transform duration-150"
                                onClick={() => handleReact(emoji, msg.id)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
                <div className="relative">
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
                            <p>{msg.forwardedMessage.originalSenderName}</p>
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
                              <div
                                className={`p-3 rounded-lg w-max max-w-xs break-words text-black whitespace-pre-wrap ${
                                  msg.senderId === userId ? "bg-[#1566A3] text-white" : "bg-[#F0F0F0]"
                                } ${isOnlyEmoji(msg.forwardedMessage.originalContentSnapshot) && msg.content?.trim() && msg.unsent === false ? "text-4xl p-2 bg-transparent" : ""}`}
                              >
                                {msg.forwardedMessage.originalContentSnapshot?.trim() ||
                                (msg.forwardedMessage.originalContentSnapshot != '" have forward this message"' &&
                                  msg.forwarded === true)
                                  ? msg.forwardedMessage.originalContentSnapshot.replace(/^"(.*)"$/, "$1")
                                  : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <span className={`text-xs block mt-1 ${msg.senderId === userId ? "text-white" : "text-black"}`}>
                        {formatTimeSendAt(msg.sentAt)}
                      </span>
                    </div>
                  )}
                  {/* UI thể hiện emote */}
                  {msg.reactions.length != 0 && (
                    <div className="absolute bg-[#252728] -bottom-3 -left-1 rounded-full flex">
                      <button className="flex items-center px-2" onClick={() => handleOpen(msg)}>
                        {Array.from(new Set(msg.reactions.map(r => r.reactionEmoji)))
                          .slice(0, 3)
                          .map((emoji, index) => (
                            <span key={index}>{emoji}</span>
                          ))}
                        {msg.reactions.length > 1 && (
                          <span className="ml-1 text-xs text-gray-400">{msg.reactions.length}</span>
                        )}
                      </button>
                      {selectedMessage != null && (
                        <Modal open={openModal} onClose={handleClose}>
                          <div
                            className="bg-gray-700 text-gray-100 rounded-lg shadow-xl w-full max-w-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col"
                            style={{ maxHeight: "80vh" }}
                          >
                            {/* Header của Modal */}
                            <div className="flex-shrink-0 px-5 py-4 border-b border-gray-600">
                              <div className="flex justify-between items-center">
                                <h2 className="text-base font-semibold text-gray-50">Message Reactions</h2>
                                <button
                                  onClick={handleClose}
                                  className="p-1.5 bg-gray-500 hover:bg-gray-400 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-blue-500"
                                  aria-label="Đóng"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Phần Tabs hoặc Filter */}
                            <div className="flex-shrink-0 px-5 pt-3 pb-2 border-b border-gray-600">
                              <div className="flex items-baseline space-x-5">
                                {/* Tab đang active: "Tất cả 1" */}
                                <button className="pb-2 border-b-2 border-blue-400 text-blue-400 focus:outline-none">
                                  <span className="text-sm font-medium">Tất cả</span>
                                  <span className="ml-1 text-sm font-medium">{msg.reactions.length}</span>
                                </button>
                              </div>
                            </div>

                            {/* Danh sách các lượt bày tỏ cảm xúc (có thể cuộn) */}
                            <div className="flex-grow overflow-y-auto p-5">
                              <div className="space-y-3">
                                {" "}
                                {/* Khoảng cách giữa các item */}
                                {/* Một item bày tỏ cảm xúc của người dùng */}
                                {selectedMessage.reactions.map((react, index) => {
                                  console.log(react) // 👈 In ra mỗi reaction

                                  return (
                                    <div key={index} className="flex items-center justify-between">
                                      <div className="flex items-center min-w-0 mr-2">
                                        <div className="min-w-0">
                                          <p className="font-medium text-sm text-gray-50 truncate">
                                            {react.senderName}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="text-2xl ml-2 flex-shrink-0">{react.reactionEmoji}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </div>
                  )}
                </div>
                {msg.senderId != userId && (
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="hover:bg-[#333334] p-2 rounded-full" onClick={() => setOpen(!open)}>
                          <CiFaceSmile size={20} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        sideOffset={8}
                        className={`bg-[#252728] border-0 rounded-3xl py-2 justify-center ${open === true ? "flex" : "hidden"}`}
                      >
                        <div className="flex items-center space-x-2 w-full justify-between px-5">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              className="text-xl hover:scale-125 transition-transform duration-150"
                              onClick={() => handleReact(emoji, msg.id)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
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
