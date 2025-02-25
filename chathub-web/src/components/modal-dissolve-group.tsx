"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { toast } from "react-toastify"

interface ModalLeaveGroupProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  chatId: number
}

const ModalDissolveGroup = ({ isOpen, setIsOpen, chatId }: ModalLeaveGroupProps) => {
  const { dissolveGroup, loading, error } = useConversation()
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const handleLeaveGroup = async () => {
    const response = await dissolveGroup(chatId, userId, token)

    if (response?.statusCode === 200) {
      setIsOpen(false)
      toast.success("Leave group successfully!")
    } else {
      toast.error("Error Dissolve group")
      setIsOpen(false)
      console.error("Failed to leave group:", response?.message || "Unknown error")
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">Dissolve Group</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-around">
          <Button className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center"
            onClick={() => handleLeaveGroup()}
          >
            Dissolve group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDissolveGroup
