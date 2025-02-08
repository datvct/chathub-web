"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Images } from "../constants/images"
import Image from "next/image"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ChangePasswordModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, setIsOpen }) => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const handleClose = () => {
        setIsOpen(false)
    }

    // const handlePasswordChange = () => {
    //     console.log("Old Password:", oldPassword)
    //     console.log("New Password:", newPassword)
    //     console.log("Confirm New Password:", confirmNewPassword)

    //     setIsOpen(false)

    //     if (newPassword !== confirmNewPassword) {
    //         alert("New password and confirm password do not match.")
    //         return
    //     }
    // }


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
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                            <DialogPanel className="w-full max-w-sm rounded-[5%] transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="absolute top-2 right-2">
                                    <button onClick={handleClose}>
                                        <Image src={Images.IconClosePurple} alt="Close" width={24} height={24} />
                                    </button>
                                </div>

                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
                                    <span className="text-[25px] font-bold">Change Password</span>
                                </DialogTitle>

                                <div className="mt-2">
                                    <div className="mb-4">
                                        <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">
                                            Old Password
                                        </label>
                                        <Input
                                            id="old-password"
                                            type="password" 
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />

                                        <button
                                            className="text-xs mt-2 text-blue-500 font-bold hover:underline float-right"
                                            onClick={() => {
                                                
                                            }}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <Input
                                            id="new-password"
                                            type="password" 
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <Input
                                            id="confirm-new-password"
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={e => setConfirmNewPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <Button
                                            type="button"
                                            className="w-30 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                                        >
                                            Change
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

export default ChangePasswordModal
