"use client"

import React, { useState, Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useConversation } from "~/hooks/use-converstation"
import { UpdateNickNameRequest } from "~/codegen/data-contracts"
import { toast } from "react-toastify"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import Image from "next/image"
import { Images } from "~/constants/images"

interface ModalUpdateNicknameProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  conversationId: number
  participantId: number
  currentNickname: string
  onNicknameUpdated: () => void
}

const ModalUpdateNickname: React.FC<ModalUpdateNicknameProps> = ({
  isOpen,
  setIsOpen,
  conversationId,
  participantId,
  currentNickname,
  onNicknameUpdated,
}) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.auth.userId)

  const [newNickname, setNewNickname] = useState<string>("")

  const { updateNickname, loading, error } = useConversation(userId, token)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setNewNickname("")
      setErrorMessage("")
    }
  }, [isOpen])

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      setErrorMessage("Nickname cannot be empty.")
      return
    }
    setErrorMessage("")

    const data: UpdateNickNameRequest = {
      conversationId: conversationId,
      participantId: participantId,
      nickName: newNickname,
    }

    try {
      const response = await updateNickname(data, token)

      if (response?.statusCode === 200) {
        toast.success("Nickname updated successfully!")
        onNicknameUpdated()
        setIsOpen(false)
      } else {
        const apiError = response?.message || error || "Failed to update nickname."
        setErrorMessage(apiError)
        toast.error(apiError)
      }
    } catch (catchError: any) {
      const message = catchError?.message || "An unexpected error occurred."
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>Update Nickname</span>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <Image src={Images.IconClosePurple} alt="Close" width={24} height={24} />
                  </button>
                </DialogTitle>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Current nickname: <span className="font-medium">{currentNickname || "Not set"}</span>
                  </p>
                  <label htmlFor="nickname-input" className="block text-sm font-medium text-gray-700 mb-1">
                    New Nickname
                  </label>
                  <Input
                    id="nickname-input"
                    type="text"
                    value={newNickname}
                    onChange={e => setNewNickname(e.target.value)}
                    placeholder="Enter new nickname"
                    className="w-full border-gray-300 rounded-md shadow-sm"
                  />
                  {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateNickname}
                    disabled={loading || !newNickname.trim()}
                    className="bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white hover:bg-gradient-to-l disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalUpdateNickname
