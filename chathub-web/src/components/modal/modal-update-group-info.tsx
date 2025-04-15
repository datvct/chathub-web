"use client"

import React, { Fragment, useState, useEffect } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import Image from "next/image"
import { Images } from "~/constants/images"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Camera } from "lucide-react"
import { useConversation } from "~/hooks/use-converstation"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
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

  const [groupName, setGroupName] = useState<string>("")
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string | null>(null)

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)

  const { updateGroupInfo, loading, error } = useConversation(userId, token)

  useEffect(() => {
    if (isOpen) {
      setGroupName(currentGroupName || "");
      setGroupAvatarPreview(currentGroupAvatar || null);
      setSelectedAvatarFile(null);
    }
  }, [isOpen, currentGroupName, currentGroupAvatar]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar image must be smaller than 2MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file (PNG, JPG, GIF).");
        return;
      }

      setSelectedAvatarFile(file)
      setGroupAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!conversationId || !userId || !token) {
      toast.error("Missing required information to update group.");
      return;
    }
    if (!groupName.trim()) {
      toast.warn("Group name cannot be empty.");
      return;
    }

    try {
      const response = await updateGroupInfo(conversationId, groupName, selectedAvatarFile);

      if (response) {
        toast.success("Group info updated successfully!");
        setIsOpen(false);
        onGroupInfoUpdated();
      }
    } catch (updateError: any) {
      console.error("Error updating group info:", updateError);
      toast.error(error || updateError.message || "Failed to update group info. Please try again.");
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !loading && setIsOpen(false)}>
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <span className="text-[25px] font-bold">Update Group Info</span>
                  <button onClick={() => !loading && setIsOpen(false)} disabled={loading}>
                    <Image src={Images.IconClosePurple} alt="close modal" width={40} height={40} />
                  </button>
                </DialogTitle>

                <div className="mt-4">
                  <div className="relative flex justify-center mb-6">
                    <label htmlFor="group-avatar-upload" className="relative cursor-pointer group">
                      <Image
                        src={groupAvatarPreview || currentGroupAvatar || Images.AvatarDefault}
                        alt="group avatar"
                        width={100}
                        height={100}
                        className="cursor-pointer mx-auto w-24 h-24 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition duration-150 object-cover shadow-lg"
                      />
                      <span className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 p-1.5 rounded-full bg-gray-200 border-2 border-white group-hover:bg-blue-100 transition duration-150">
                        <Camera className="text-gray-600 w-4 h-4" strokeWidth={2} />
                      </span>
                      <input
                        id="group-avatar-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        onChange={handleAvatarChange}
                        disabled={loading}
                      />
                    </label>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="group-name" className="block text-sm font-medium text-black mb-1">
                      Group Name
                    </label>
                    <Input
                      id="group-name"
                      type="text"
                      placeholder="Enter new group name"
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      disabled={loading}
                      maxLength={50}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-lg text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !groupName.trim()}
                      className="w-auto min-w-[100px] px-4 py-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] rounded-lg text-white text-base font-medium hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#501794] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </div>
                      ) : "Update"}
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
