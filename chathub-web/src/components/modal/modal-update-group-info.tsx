"use client"

import React, { Fragment, useState, useRef } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import Image from "next/image"
import { Images } from "~/constants/images"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Camera } from "lucide-react"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { UpdateGroupInfoRequest } from "~/codegen/data-contracts"
import { toast } from "react-toastify"

interface ModalUpdateGroupInfoProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  conversationId: number
  currentGroupName?: string
  currentGroupAvatar?: string
  onGroupInfoUpdated: () => void
}

const ModalUpdateGroupInfo: React.FC<ModalUpdateGroupInfoProps> = ({
  isOpen,
  setIsOpen,
  conversationId,
  currentGroupName,
  currentGroupAvatar,
  onGroupInfoUpdated,
}) => {
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.auth.userId)

  const [groupName, setGroupName] = useState<string>(currentGroupName || "")
  const [groupAvatar, setGroupAvatar] = useState<string | null>(currentGroupAvatar || null)
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { updateGroupInfo } = useConversation(userId!, token!)

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedAvatarFile(file)
      setGroupAvatar(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!conversationId || !userId || !token) return

    setLoading(true)

    try {
      let avatarFileToUpload: File | undefined = selectedAvatarFile || undefined

      if (avatarFileToUpload && avatarFileToUpload.size > 1024 * 1024) {
        toast.error("Avatar file size must be less than 1MB.")
        setLoading(false)
        return
      }

      const updateRequest: UpdateGroupInfoRequest = {
        userId: userId!,
        groupName: groupName,
        avatar: avatarFileToUpload,
      }

      const updateSuccess = await updateGroupInfo(conversationId, updateRequest, token)

      if (updateSuccess?.statusCode === 200) {
        toast.success("Group info updated successfully!")
        setIsOpen(false)
        onGroupInfoUpdated()
      } else {
        toast.error("Failed to update group info.")
      }
    } catch (error) {
      console.error("Error updating group info:", error)
      toast.error("Failed to update group info.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[5%] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <span className="text-[25px] font-bold">Update Group Info</span>
                  <button onClick={() => setIsOpen(false)}>
                    <Image src={Images.IconClosePurple} alt="close modal" width={40} height={40} />
                  </button>
                </DialogTitle>

                <div className="mt-4">
                  <div className="relative flex justify-center mb-6">
                    <label htmlFor="group-avatar-upload" className="relative cursor-pointer">
                      <Image
                        src={groupAvatar || currentGroupAvatar || Images.ProfileImage}
                        alt="group avatar"
                        width={100}
                        height={100}
                        className="cursor-pointer mx-auto w-24 h-24 rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan"
                      />
                      <span className="absolute bottom-[-10px] left-[55%] rounded-[50px] bg-[#F1F1F1] hover:bg-slate-300 w-[37px] h-[37px] flex items-center justify-center">
                        <Camera className="text-[#797979] w-5 h-5" strokeWidth={1.5} />
                      </span>
                      <input
                        id="group-avatar-upload"
                        type="file"
                        accept=".png,.jpg,.gif,.jpeg"
                        className="opacity-0 absolute top-0 inset-0 w-full h-full cursor-pointer"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="group-name" className="block text-sm font-medium text-black">
                      Group Name
                    </label>
                    <div className="mt-1">
                      <Input
                        id="group-name"
                        type="text"
                        placeholder="Enter new group name"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-4 w-full">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-500 rounded-lg text-white text-lg hover:bg-[#535353]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-30 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalUpdateGroupInfo
