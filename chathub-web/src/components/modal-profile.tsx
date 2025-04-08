"use client"

import React, { useState, useEffect, useCallback, Fragment } from "react"
import { Camera, X as IconX } from "lucide-react"
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
import { useUpdateProfile, useCurrentUserProfile } from "~/hooks/use-user"
import { ChangeProfileRequest, UserDTO } from "~/codegen/data-contracts"
import dayjs from "dayjs"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ProfileModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setIsChangePasswordModalOpen?: (open: boolean) => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, setIsOpen, setIsChangePasswordModalOpen }) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)

  const [formData, setFormData] = useState<Partial<UserDTO>>({})
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [dateValue, setDateValue] = useState<dayjs.Dayjs | null>(null)

  const {
    profile: initialUserData,
    isLoading: isLoadingProfile,
    error: profileError,
    fetchProfile,
  } = useCurrentUserProfile(userId, token)

  const {
    updateProfile,
    loading: isUpdatingProfile,
  } = useUpdateProfile()

  useEffect(() => {
    if (initialUserData) {
      console.log("Syncing initialUserData to form:", initialUserData)
      setFormData({
        name: initialUserData.name,
        dateOfBirth: initialUserData.dateOfBirth,
        gender: initialUserData.gender as "MALE" | "FEMALE" | undefined,
      })
      setDateValue(initialUserData.dateOfBirth ? dayjs(initialUserData.dateOfBirth) : null)
      if (previewImage === null || !previewImage.startsWith("blob:")) {
        setPreviewImage(initialUserData.avatar || null)
      }
    } else {
      setFormData({})
      setDateValue(null)
      setPreviewImage(null)
      setSelectedImageFile(null)
    }
  }, [initialUserData])

  const handleOpenChangePassword = () => {
    setIsOpen(false)
    if (setIsChangePasswordModalOpen) {
      setIsChangePasswordModalOpen(true)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size < 2MB.")
        return
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Invalid image file (JPG, PNG, GIF).")
        return
      }
      setSelectedImageFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gender: event.target.value as "MALE" | "FEMALE" }))
  }

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDateValue(newDate)
    setFormData(prev => ({ ...prev, dateOfBirth: newDate ? newDate.format("YYYY-MM-DD") : undefined }))
  }

  const handleSubmit = async () => {
    if (!userId || !token) {
      toast.error("Authentication error.")
      return
    }
    if (!formData.name?.trim()) {
      toast.error("Display Name cannot be empty.")
      return
    }

    const dataForHook: ChangeProfileRequest = {
      id: userId,
      name: formData.name.trim(),
      ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
      ...(formData.gender && { gender: formData.gender }),
      ...(selectedImageFile && { avatar: selectedImageFile }),
    }

    console.log("Submitting profile update (as object):", dataForHook)

    try {
      const response = await updateProfile(dataForHook, token)
      console.log("Update profile response:", response)

      if (response?.statusCode === 200) {
        toast.success("Profile updated successfully!", { autoClose: 2000 })
        setSelectedImageFile(null)
        await fetchProfile()
      } else {
        console.error(response?.message || "Failed to update profile.")
      }
    } catch (error: any) {
      console.error("Update profile failed:", error)
      const msg = error?.message || "An error occurred. Please try again."
      toast.error(msg)
    }
  }

  const renderLoadingInsideModal = isLoadingProfile && !initialUserData && isOpen
  const renderErrorInsideModal = !!profileError && !initialUserData && isOpen

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !isUpdatingProfile && setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
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
              <DialogPanel
                className="w-full max-w-md transform overflow-hidden rounded-2xl
                  bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-left align-middle shadow-xl
                  transition-all border border-gray-200"
              >
                <ToastContainer position="bottom-center" theme="colored" autoClose={3000} hideProgressBar />

                {renderLoadingInsideModal ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600 mb-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>{" "}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>{" "}
                    </svg>
                    <p className="text-gray-600">Loading Profile...</p>
                  </div>
                ) : renderErrorInsideModal ? (
                  <div className="py-10 text-center">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-red-700 mb-2">
                      Error Loading Profile
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mb-4">{profileError}</p>
                    <Button
                      onClick={() => {
                        fetchProfile()
                      }}
                      variant="outline"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-800 flex items-center justify-between mb-5"
                    >
                      <span>My Profile</span>
                      <button
                        onClick={() => !isUpdatingProfile && setIsOpen(false)}
                        disabled={isUpdatingProfile}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <IconX size={20} />
                      </button>
                    </DialogTitle>

                    <div className="mt-2 space-y-5">
                      <div className="relative flex justify-center">
                        <label htmlFor="profile-upload" className="relative cursor-pointer group">
                          <Image
                            src={previewImage || Images.ProfileImage.src}
                            alt="Profile Avatar"
                            width={112}
                            height={112}
                            className="mx-auto w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg group-hover:opacity-90 transition-opacity bg-gray-300"
                            key={previewImage || initialUserData?.avatar}
                          />
                          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Camera className="text-white w-7 h-7" strokeWidth={1.5} />
                          </div>
                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData?.name || initialUserData?.name}
                          placeholder="Enter your display name"
                          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {" "}
                          <DatePicker
                            value={dateValue}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                            slotProps={{
                              textField: {
                                size: "small",
                                fullWidth: true,
                                placeholder: "Select date",
                                InputLabelProps: { shrink: true },
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "white",
                                    borderRadius: "0.375rem",
                                    fontSize: "0.875rem",
                                  },
                                  "& .MuiInputLabel-root": { fontSize: "0.875rem" },
                                },
                              },
                            }}
                          />{" "}
                        </LocalizationProvider>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                        <div className="mt-1 flex items-center space-x-6">
                          <div className="flex items-center">
                            <input
                              id="male"
                              type="radio"
                              name="gender"
                              value="MALE"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={formData.gender === "MALE"}
                              onChange={handleGenderChange}
                            />{" "}
                            <label htmlFor="male" className="ml-2 text-sm text-gray-800 cursor-pointer">
                              Male
                            </label>{" "}
                          </div>
                          <div className="flex items-center">
                            <input
                              id="female"
                              type="radio"
                              name="gender"
                              value="FEMALE"
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 cursor-pointer"
                              checked={formData.gender === "FEMALE"}
                              onChange={handleGenderChange}
                            />{" "}
                            <label htmlFor="female" className="ml-2 text-sm text-gray-800 cursor-pointer">
                              Female
                            </label>{" "}
                          </div>
                        </div>
                      </div>
                      {setIsChangePasswordModalOpen && (
                        <button
                          onClick={handleOpenChangePassword}
                          className="w-full flex items-center justify-between text-left px-3 py-2.5 bg-white border rounded-md text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {" "}
                          <span>Change Password</span>{" "}
                          {Images.IconNext && (
                            <Image src={Images.IconNext} alt=">" width={12} height={12} className="opacity-50" />
                          )}{" "}
                        </button>
                      )}
                    </div>

                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                      <Button
                        onClick={() => !isUpdatingProfile && setIsOpen(false)}
                        variant="outline"
                        className="px-5 py-2 rounded-lg border-gray-200 bg-gray-500 text-white hover:text-white hover:bg-gray-600"
                        disabled={isUpdatingProfile}
                      >
                        {" "}
                        Cancel {" "}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isUpdatingProfile || isLoadingProfile}
                        className="min-w-[120px] px-5 py-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l text-white rounded-md disabled:opacity-60 flex items-center justify-center"
                      >
                        {isUpdatingProfile ? (
                          <>
                            {" "}
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="opacity-25"
                              ></circle>{" "}
                              <path
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                className="opacity-75"
                              ></path>{" "}
                            </svg>{" "}
                            Saving...{" "}
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition >
  )
}

export default ProfileModal
