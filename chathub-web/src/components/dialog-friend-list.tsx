"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import React, { Fragment } from "react"
import Image from "next/image"
import { Images } from "../constants/images"

interface Friend {
    name: string
    phone: string
    online?: boolean
    image: any
}

const FriendListDialog: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void; friend: Friend }> = ({ isOpen, setIsOpen, friend }) => {
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
                            <DialogPanel className="w-60 rounded-[10%] transform overflow-hidden bg-gradient-to-r from-[#501794] to-[#3E70A1] p-4 text-left align-middle shadow-xl transition-all">
                                <div className="mt-2 space-y-2">
                                    <button className="flex items-center gap-x-3 w-full px-2 py-3 rounded-lg text-white hover:bg-[#431078] hover:bg-opacity-50">
                                        <Image src={Images.IconProfile} alt="Profile" width={24} height={24} />
                                        Profile
                                    </button>

                                    <button className="flex items-center gap-x-3 w-full px-2 py-3 rounded-lg text-white hover:bg-[#431078] hover:bg-opacity-50">
                                        <Image src={Images.IconMessage} alt="Message" width={24} height={24} />
                                        Message
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default FriendListDialog