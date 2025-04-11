"use client"

import React, { useState, Fragment } from "react"
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

  const [nickname, setNickname] = useState<string>(currentNickname)
  const { updateNickname, loading } = useConversation(userId, token)
  const [errorMessage, setErrorMessage] = useState("")

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      setErrorMessage("Nickname cannot be empty.")
      return
    }
    setErrorMessage("")

    const data: UpdateNickNameRequest = {
      conversationId,
      participantId,
      nickName: nickname,
    }

    try {
      const response = await updateNickname(data, token)
      if (response) {
        toast.success("Nickname updated successfully!")
        setIsOpen(false)
        onNicknameUpdated()
      } else {
        setErrorMessage("Failed to update nickname.")
      }
    } catch (error) {
      console.error("Error updating nickname:", error)
      setErrorMessage(error?.message || "Failed to update nickname.")
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900 uppercase">
                    Update Nickname
                  </DialogTitle>
                  <div className="mt-2">
                    <Input
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="Enter new nickname"
                    />
                    {errorMessage && <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>}
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => setIsOpen(false)}
                      disabled={loading}
                      className="bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateNickname}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalUpdateNickname
