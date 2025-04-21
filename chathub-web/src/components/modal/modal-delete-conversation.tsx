"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { toast } from "react-toastify"

interface ModalDeleteConversationProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  chatId: number
  onHistoryDeleted: () => void
  handleReloadConverstation?: () => void
}

const ModalDeleteConversation = ({
  isOpen,
  setIsOpen,
  chatId,
  onHistoryDeleted,
  handleReloadConverstation,
}: ModalDeleteConversationProps) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const { deleteConversation, loading } = useConversation(userId, token)

  const handleDeleteConversation = async () => {
    if (!chatId || !userId || !token) return
    try {
      const response = await deleteConversation(chatId, userId, token)
      if (response) {
        handleReloadConverstation()
        toast.success("Deleted chat history successfully!")
        setIsOpen(false)
        onHistoryDeleted()
      } else {
        throw new Error("Failed to delete conversation")
      }
    } catch (error) {
      toast.error("Failed to delete conversation")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">
            Delete Conversation
          </DialogTitle>
        </DialogHeader>

        <div className="text-center text-base text-white">Are you sure you want to delete this chat history?</div>

        <div className="flex items-center justify-around">
          <Button
            className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center hover:bg-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center hover:bg-[#B22222]"
            onClick={handleDeleteConversation}
            disabled={loading}
          >
            {loading ? "Processing..." : "Delete Conversation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDeleteConversation
