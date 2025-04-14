"use client"

import React, { Fragment, useEffect, useState } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import moment from "moment"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ConversationResponse, MessageResponse } from "~/codegen/data-contracts"
import { forwardMessage } from "~/lib/get-message"
import { useFriends } from "../../hooks/use-friends"
import { useConversation } from "../../hooks/use-converstation"
import { findSingleChat } from "~/lib/get-conversation"
import WebSocketService from "../../lib/web-socket-service"

interface ForwardMessageModalProps {
  isOpen: boolean
  onClose: () => void
  message: MessageResponse
  userId: number
  token: string
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({ isOpen, onClose, message, userId, token }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [note, setNote] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dataGroup, setDataGroup] = useState<ConversationResponse[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const { friends: fetchedFriends } = useFriends(userId, token)
  const { getRecentConversation } = useConversation(userId, token)
  const [conversationIds, setConversationIds] = useState<number[]>([])

  useEffect(() => {
    if (userId) {
      const init = async () => {
        const response = await getRecentConversation(userId, token)
        if (response) {
          const groupConversations = response.filter(group => group.chatType === "GROUP")
          setDataGroup(groupConversations)
        }
      }
      init()
    }
  }, [userId, token])

  const filteredFriends =
    fetchedFriends?.filter(friend => {
      if (!friend) return false
      const term = searchTerm.toLowerCase()
      const nameMatch = friend.name?.toLowerCase().includes(term)
      const phoneMatch = friend.phoneNumber?.includes(term)
      return nameMatch || phoneMatch
    }) || []

  const filteredGroups =
    dataGroup?.filter(group => {
      const term = searchTerm.toLowerCase()
      return group.groupName?.toLowerCase().includes(term)
    }) || []

  const combinedList = [
    ...filteredFriends.map(friend => ({
      type: "friend",
      id: friend.id,
      label: `${friend.name} (${friend.phoneNumber})`,
      avatar: friend.avatar,
    })),
    ...filteredGroups.map(group => ({
      type: "group",
      id: group.id,
      label: `${group.groupName}`,
      avatar: group.groupAvatar,
    })),
  ]

  const handleForward = async () => {
    if (selectedUsers.length === 0 && selectedGroups.length === 0) return // Kiểm tra nếu không có gì được chọn

    // Kết hợp các ID người dùng và nhóm lại để truyền vào hàm forwardMessage
    const allSelectedIds = [...conversationIds, ...selectedGroups]

    const response = await forwardMessage(userId, message.id, allSelectedIds, token, note)

    if (response) {
      // Xử lý phản hồi nếu cần
      console.log("Message forwarded successfully:", response)
      const ws = WebSocketService.getInstance()
      const stompClient = ws.getStompClient()

      // Gửi từng message đã forward vào đúng topic WebSocket
      response.forEach((msg: MessageResponse) => {
        const topic = `/topic/message/${msg.conversationId}`

        stompClient?.publish({
          destination: topic,
          body: JSON.stringify(msg),
        })
      })

      response.forEach((msg: MessageResponse) => {
        const topic = `/topic/conversation/${msg.conversationId}`

        stompClient?.publish({
          destination: topic,
          body: JSON.stringify(msg),
        })
      })
    }

    onClose() // Đóng modal sau khi hoàn thành
  }

  const toggleUser = async (friendId: number) => {
    const isSelected = selectedUsers.includes(friendId)

    if (isSelected) {
      setSelectedUsers(prev => prev.filter(uid => uid !== friendId))

      const conversation = await findSingleChat(userId, friendId, token)
      const conversationId = conversation?.id
      if (conversationId) {
        setConversationIds(prev => prev.filter(id => id !== conversationId))
      }
    } else {
      setSelectedUsers(prev => [...prev, friendId])

      const conversation = await findSingleChat(userId, friendId, token)
      console.log("conversation", conversation)

      const conversationId = conversation?.id
      if (conversationId) {
        setConversationIds(prev => [...prev, conversationId])
      } else {
        console.warn("Không tìm thấy conversation cho friendId:", friendId)
      }
    }
  }

  const toggleGroup = (id: number) => {
    setSelectedGroups(prev => (prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]))
  }

  if (!message) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">Forward Message</DialogTitle>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forward to</label>
                  <Input
                    type="text"
                    placeholder="Search by name or phone number"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2">
                  {combinedList.map(item => (
                    <label
                      key={`${item.type}-${item.id}`}
                      className="flex items-center gap-2 text-sm py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          item.type === "friend" ? selectedUsers.includes(item.id) : selectedGroups.includes(item.id)
                        }
                        onChange={() => {
                          item.type === "friend" ? toggleUser(item.id) : toggleGroup(item.id)
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <img src={item.avatar} alt={item.label} className="w-6 h-6 rounded-full object-cover" />
                        <span>{item.label}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type your message here (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                <div className="mb-4 border p-3 rounded bg-gray-100 text-sm">
                  <div className="font-semibold mb-1">
                    {message.senderName} – {moment(message.sentAt).format("LLL")}
                  </div>
                  <div>{message.content}</div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleForward}>Forward</Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ForwardMessageModal
