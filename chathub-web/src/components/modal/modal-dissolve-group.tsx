"use client"

import React from "react"
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
  isAdmin: boolean
}

const ModalDissolveGroup = ({ isOpen, setIsOpen, chatId, isAdmin }: ModalLeaveGroupProps) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  const { dissolveGroup, loading, error } = useConversation(userId, token)

  const handleDissolveGroup = async () => {
    if (!isAdmin) {
      toast.error("Only admins can dissolve the group!")
      return
    }

    try {
      const response = await dissolveGroup(chatId, userId, token)

      if (response?.statusCode === 200) {
        toast.success("Group dissolved successfully!")
        setIsOpen(false)
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        toast.error("Failed to dissolve group")
      }
    } catch (error) {
      toast.error("An error occurred while dissolving the group.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">Dissolve Group</DialogTitle>
        </DialogHeader>

        <div className="text-center text-base text-white">Are you sure you want to dissolve this group?</div>

        <div className="flex items-center justify-around">
          <Button
            className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center hover:bg-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center hover:bg-[#B22222]"
            onClick={handleDissolveGroup}
          >
            {loading ? "Processing..." : "Dissolve Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDissolveGroup
