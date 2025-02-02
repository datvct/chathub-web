"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Images } from "../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../styles/custom-scroll.css"

interface ModalCreateNewChatProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ModalCreateNewChat: React.FC<ModalCreateNewChatProps> = ({ isOpen, setIsOpen }) => {
  const users = [
    { name: "Guy Hawkins", phone: "0903112233", image: Images.GuyHawkins },
    { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards },
    { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward },
    { name: "Albert Flores", phone: "0905336699", image: Images.AlbertFlores },
    { name: "Miley Cyrus", phone: "0909225588", image: Images.MileyCyrus },
    { name: "Arlene McCoy", phone: "0906114477", image: Images.ArleneMcCoy },
    { name: "Cameron Williamson", phone: "0902115599", image: Images.CameronWilliamson },
  ]

  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-opacity-[.40]" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-2">
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="bg-[#385068] rounded-[5%] p-6 w-[80%] h-[95%] max-w-lg max-h-screen transition-all transform">
            <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
              <span className="text-[30px] font-bold">New Chat</span>
              <button onClick={() => setIsOpen(false)}>
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
              </button>
            </DialogTitle>

            <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Search by phone number"
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
            </div>

            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {users.map((user, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3
                              ${selectedUser === index ? "bg-[#7a99b8]/90" : ""}
                              bg-[#fff]
                              hover:bg-[#93C1D2]
                            `}
                  onClick={() => setSelectedUser(index)}
                >
                  <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-black">{user.name}</p>
                    <p className="text-sm text-gray-700">{user.phone}</p>
                  </div>
                  <EllipsisVertical className="ml-auto text-gray-500" />
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-5">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#71808E] rounded-lg text-white text-lg hover:bg-[#535353]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l"
                disabled={selectedUser === null}
              >
                Chat
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  )
}

export default ModalCreateNewChat
