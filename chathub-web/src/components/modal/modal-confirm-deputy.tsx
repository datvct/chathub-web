"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { toast } from "react-toastify"

interface ModalDeputyGroupProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  chatId: number
  isAdmin: boolean
  userId: number
  token: string
  selectDeputyId: number
  type: "grant" | "revoke"
  handleReloadMemeber?: () => void
}

const ModalConfirmDeputy = ({
  isOpen,
  setIsOpen,
  chatId,
  isAdmin,
  token,
  userId,
  selectDeputyId,
  type,
  handleReloadMemeber,
}: ModalDeputyGroupProps) => {
  const { grantDeputyGroup, revokeDeputy, loading, error } = useConversation(userId, token)

  const handleGrantDeputy = async () => {
    if (!isAdmin) {
      toast.error("Only admins can dissolve the group!")
      return
    }

    try {
      const response = await grantDeputyGroup(chatId, selectDeputyId, userId, token)

      if (response?.statusCode === 200) {
        toast.success("Grant deputy successfully!")
        setIsOpen(false)
        handleReloadMemeber()
      } else {
        toast.error("Failed to  revoke deputy")
      }
    } catch (error) {
      toast.error("An error the group.")
    }
  }

  const handleRevokeDepty = async () => {
    if (!isAdmin) {
      toast.error("Only admins can dissolve the group!")
      return
    }

    try {
      const response = await revokeDeputy(chatId, selectDeputyId, userId, token)

      if (response?.statusCode === 200) {
        toast.success("Revoke deputy successfully!")
        setIsOpen(false)
        handleReloadMemeber()
      } else {
        toast.error("Failed to revoke deputy")
      }
    } catch (error) {
      toast.error("An error the group.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl bg-[#363636] border-[#363636]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-center text-white uppercase">
            {type === "grant" ? "Grant deputy" : "Revoke deputy"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center text-base text-white">
          {type === "grant" ? "Are you sure you want to grant deputy?" : "Are you sure you want to revoke deputy?"}
        </div>

        <div className="flex items-center justify-around">
          <Button
            className="p-4 h-10 bg-white text-[#2D2D2D] rounded-lg text-center hover:bg-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="p-4 h-10 bg-[#FF2F2F] text-white rounded-lg text-center hover:bg-[#B22222]"
            onClick={type === "grant" ? handleGrantDeputy : handleRevokeDepty}
          >
            {loading ? "Processing..." : type === "grant" ? "Grant" : "Revoke"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfirmDeputy
