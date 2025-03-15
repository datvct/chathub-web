"use client"

import React, { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Images } from "../constants/images"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useUpdateProfile } from "~/hooks/use-user"
import { ChangeProfileRequest, UserDTO } from "~/codegen/data-contracts"
import dayjs from "dayjs"
import { toast, ToastContainer } from "react-toastify"

interface ProfileModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setIsChangePasswordModalOpen?: any
  friend: UserDTO | null
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  setIsOpen,
  setIsChangePasswordModalOpen,
  friend
}) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const { updateProfile, loading } = useUpdateProfile();
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<UserDTO | null>(null)

  const handleOpenChangePassword = () => {
    setIsOpen(false)
    setIsChangePasswordModalOpen(true)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleChange = (field: keyof UserDTO, value: string | Date | "MALE" | "FEMALE") => {
    setProfileData(prev => ({
      ...prev,
      ...(prev && { [field]: value })
    }));
  }

  const [date, setDate] = useState(dayjs(profileData?.dateOfBirth))

  const handleDateOfBirth = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate || dayjs())
    setProfileData(prev => ({
      ...prev,
      dateOfBirth: newDate ? newDate.toISOString() : prev?.dateOfBirth,
    }))
  }

  useEffect(() => {
    if (friend) {
      setProfileData({
        id: friend.id,
        phoneNumber: friend.phoneNumber,
        name: friend.name || "",
        dateOfBirth: friend.dateOfBirth,
        gender: friend.gender as "MALE" | "FEMALE",
        avatar: friend.avatar,
        status: friend.status,
      });
    } else {
      setProfileData(null);
    }
  }, [friend]);

  const handleSubmit = async () => {
    const formattedDate = dayjs(profileData.dateOfBirth).format('YYYY/MM/DD');

    const data: ChangeProfileRequest = {
      id: userId!,
      name: profileData?.name || "",
      avatar: selectedImage
        ? await fetch(selectedImage).then(res => res.blob()).then(blob => new File([blob], "avatar.jpg", { type: blob.type }))
        : new File([await fetch(friend?.avatar || Images.AvatarDefault.src).then(res => res.blob())], "avatar.jpg", { type: "image/jpeg" }),
      dateOfBirth: formattedDate,
      gender: profileData?.gender as "MALE" | "FEMALE" || "MALE",
    };

    try {
      const response = await updateProfile(data, token!);
      if (response.success) {
        setIsOpen(false)
      } else {
        toast.error('Failed to update profile')
        setErrorMessage(response.error)
      }
    } catch (error: any) {
      console.log('Failed to update profile')
    }
  };

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
                <ToastContainer />
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
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="profile icon"
                          width={100}
                          height={100}
                          className="cursor-pointer mx-auto w-24 h-24 rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan"
                        />
                      ) : (
                        <Image
                          src={profileData?.avatar || Images.ProfileImage}
                          alt="profile default"
                          width={100}
                          height={100}
                          className="mx-auto cursor-pointer w-24 h-24 rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan"
                        />
                      )}

                      <span className="absolute bottom-[-10px] left-[55%] rounded-[50px] bg-[#F1F1F1] hover:bg-slate-300 w-[37px] h-[37px] flex items-center justify-center">
                        <Camera className="text-[#797979] w-5 h-5" strokeWidth={1.5} />
                      </span>

                      <input
                        id="profile-upload"
                        type="file"
                        accept=".png,.jpg,.gif,.jpeg"
                        className="opacity-0 absolute top-0 inset-0 w-full h-full cursor-pointer"
                        onChange={handleImageChange}
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
                        value={friend?.name}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        onChange={e => handleChange("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <label htmlFor="date-of-birth" className="block text-sm font-medium text-black">
                      Date of Birth
                    </label>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Date of Birth"
                          value={date}
                          onChange={handleDateOfBirth}
                          className="w-full block bg-white border border-slate-300"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-black">Gender</label>

                    <div className="mt-2">
                      <div className="flex items-center gap-x-3 mb-2.5">
                        <input
                          id="male"
                          type="radio"
                          value="Male"
                          className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
                          checked={profileData?.gender === "MALE"}
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
                          value="Female"
                          className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
                          checked={profileData?.gender === "FEMALE"}
                          onChange={() => handleChange("gender", "FEMALE")}
                        />

                        <label htmlFor="female" className="block text-sm leading-6">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenChangePassword}
                    className="bg-white w-full justify-between flex items-center border-[1px] rounded-lg px-3 h-[48px] hover:bg-slate-50 hover:text-gray-900 hover:border-[#93C1D2] border-[#D4D4D4] text-[#282828] mt-4"
                  >
                    <span>Change Password</span>
                    <Image src={Images.IconNext} alt="Icon Next" width={10} height={10} />
                  </button>

                  <div className="flex items-end justify-end gap-4 mt-9 w-full">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-30 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white
                        bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                    >
                      {loading ? "Loading..." : "Save changes"}
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

export default ProfileModal
