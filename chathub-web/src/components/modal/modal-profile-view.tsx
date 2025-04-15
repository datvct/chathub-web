"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import dayjs from "dayjs"
import { UserDTO } from "~/codegen/data-contracts"

interface ProfileData {
  displayName: string
  dateOfBirth?: string | Date
  gender: string
}

interface ProfileViewModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  friend: UserDTO | null
}

const ProfileViewModal: React.FC<ProfileViewModalProps> = ({ isOpen, setIsOpen, friend }) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: friend?.name || "",
    dateOfBirth: friend?.dateOfBirth || new Date(),
    gender: friend?.gender || "MALE",
  })

  const handleChange = (field: keyof ProfileData, value: string | Date | "MALE" | "FEMALE") => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleDateOfBirth = (newDate: dayjs.Dayjs | null) => {
    setProfileData(prev => ({
      ...prev,
      dateOfBirth: friend?.dateOfBirth || new Date(),
    }))
  }

  useEffect(() => {
    setProfileData({
      displayName: friend?.name || "",
      dateOfBirth: friend?.dateOfBirth || new Date(),
      gender: friend?.gender || "MALE",
    })
  }, [friend])

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={React.Fragment}
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
              as={React.Fragment}
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
                  <span className="text-[25px] font-bold">Profile</span>
                  <button onClick={() => setIsOpen(false)}>
                    <Image src={Images.IconClosePurple} alt="close modal" width={40} height={40} />
                  </button>
                </DialogTitle>

                <div className="mt-2">
                  <div className="relative">
                    <label htmlFor="profile-upload" className="relative cursor-pointer">
                      <Image
                        src={friend?.avatar ?? Images.AvatarDefault}
                        alt="profile default"
                        width={100}
                        height={100}
                        className="mx-auto cursor-pointer w-24 h-24 rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan object-cover"
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="display-name" className="block text-sm font-medium text-black">
                      Display Name
                    </label>

                    <div className="mt-1">
                      <Input
                        id="display-name"
                        type="text"
                        value={profileData.displayName}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        onChange={e => handleChange("displayName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <label htmlFor="date-of-birth" className="block text-sm font-medium text-black">
                      Date of Birth
                    </label>
                    <div className="mt-1">
                      <div className="mt-1">
                        <Input
                          type="text"
                          value={dayjs(profileData.dateOfBirth).format("MMMM D, YYYY")}
                          readOnly
                          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black">Gender</label>

                    <div className="mt-2">
                      <div className="flex items-center gap-x-3 mb-2.5">
                        <input
                          id="male"
                          type="radio"
                          value="MALE"
                          disabled
                          className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
                          checked={profileData.gender === "MALE"}
                          onChange={() => handleChange("gender", "MALE")}
                        />

                        <label htmlFor="male" className="block text-sm leading-6">
                          Male
                        </label>
                      </div>

                      <div className="flex items-center gap-x-3">
                        <input
                          id="female"
                          type="radio"
                          value="FEMALE"
                          disabled
                          className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
                          checked={profileData.gender === "FEMALE"}
                          onChange={() => handleChange("gender", "FEMALE")}
                        />

                        <label htmlFor="female" className="block text-sm leading-6">
                          Female
                        </label>
                      </div>
                    </div>
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

export default ProfileViewModal
