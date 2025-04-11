"use client"

import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { toast } from "react-toastify"

interface ModalLeaveGroupProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  chatId: number
  setSelectedChatId: Dispatch<SetStateAction<number | null>>
}

<<<<<<< HEAD
<<<<<<< HEAD:chathub-web/src/components/modal-leave-group.tsx
const ModalLeaveGroup = ({
  isOpen,
  setIsOpen,
  chatId,
  setSelectedChatId,
}: ModalLeaveGroupProps) => {
  const router = useRouter()

  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const {
    leaveConversationById,
    loading,
    error
  } = useConversation(userId, token)
=======
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7
const ModalLeaveGroup = ({ isOpen, setIsOpen, chatId, setSelectedChatId }: ModalLeaveGroupProps) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const { leaveConversationById, loading, error } = useConversation(userId, token)
  const router = useRouter()
<<<<<<< HEAD
>>>>>>> 28c0e5fae504493ab038b74c9e28b46d014129db:chathub-web/src/components/modal/modal-leave-group.tsx
=======
>>>>>>> 8e4a6c2a950f6aed9770ccfd1f2f5105e202fbf7

  const handleLeaveGroup = async () => {
    if (!chatId || !userId || !token) return
    try {
      await leaveConversationById(chatId, userId, token)
      toast.success("Leaved group successfully!")
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to leave group")
      console.error("Error leaving group:", error)
    } finally {
      setTimeout(() => {
        window.location.reload()
      }, 6000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">Leave this group</DialogTitle>
        </DialogHeader>
        <div className="text-center text-base text-white">Are you sure you want to leave this group?</div>

        <div className="flex items-center justify-around">
          <Button
            className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center hover:bg-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center
            hover:bg-[#B22222]"
            onClick={() => handleLeaveGroup()}
            disabled={loading}
          >
            {loading ? "Processing..." : "Leave"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalLeaveGroup
