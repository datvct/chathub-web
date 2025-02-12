import React, { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Images } from "../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../styles/custom-scroll.css"
import { LogOut } from "lucide-react"
import { CircleX } from "lucide-react"

interface ModalListGroupProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isAdmin: boolean
}

const ModalListGroup: React.FC<ModalListGroupProps> = ({ isOpen, setIsOpen, isAdmin }) => {
  const groups = [
    { name: "Group A", chat: "You: abcdef", image: Images.GuyHawkins },
    { name: "Group B", chat: "Anh A: xin chào, tôi tên là A", image: Images.RonaldRichards },
    { name: "Group C", chat: "You: abcdef", image: Images.EstherHoward },
    { name: "Group D", chat: "You: abcdef", image: Images.AlbertFlores },
    { name: "Group E", chat: "You: abcdef", image: Images.MileyCyrus },
    { name: "Group F", chat: "You: abcdef", image: Images.ArleneMcCoy },
    { name: "Group G", chat: "You: abcdef", image: Images.CameronWilliamson },
  ]

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [showOptionsForGroup, setShowOptionsForGroup] = useState<number | null>(null)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null)

  // Use ref to store the position of each group item
  const groupRefs = useRef<(HTMLLIElement | null)[]>([])

  const handleEllipsisClick = (index: number) => {
    if (showOptionsForGroup === index) {
      setShowOptionsForGroup(null) // Close if already open
    } else {
      setShowOptionsForGroup(index) // Open the clicked group's options
      // Get position of the clicked group item
      const groupElement = groupRefs.current[index]
      if (groupElement) {
        const rect = groupElement.getBoundingClientRect()
        setModalPosition({
          top: rect.top + window.scrollY, // Add scroll position if needed
          left: rect.left + window.scrollX, // Add scroll position if needed
        })
      }
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setShowOptionsForGroup(null)
      }}
      className="relative z-50"
    >
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
            <DialogPanel className="overflow-visible bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
                <div className="flex items-center gap-x-2">
                  <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                  <span className="text-[25px] font-bold">Group List</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setShowOptionsForGroup(null)
                  }}
                >
                  <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                </button>
              </DialogTitle>

              <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

              <div className="relative mb-2">
                <Input
                  type="text"
                  placeholder="Search by group name"
                  className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
                />
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
              </div>

              <Button className="w-20 py-2 px-4 mb-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l">
                All ({groups.length})
              </Button>

              <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
                {groups.map((group, index) => (
                  <li
                    key={index}
                    ref={el => {
                      groupRefs.current[index] = el
                    }} // Assign ref to each group item
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3
                              ${selectedGroup === index ? "bg-[#7a99b8]/90" : ""}
                              bg-[#fff]
                              hover:bg-[#93C1D2]
                            `}
                  >
                    <Image src={group.image} alt={group.name} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-semibold text-black">{group.name}</p>
                      <p className="text-sm text-gray-700">{group.chat}</p>
                    </div>
                    <EllipsisVertical
                      className="ml-auto text-gray-500"
                      onClick={e => {
                        handleEllipsisClick(index)
                      }} // Call the click handler
                    />
                  </li>
                ))}
              </ul>

              {/* Modal for Leave Group / Dissolve */}
              {showOptionsForGroup !== null && modalPosition && (
                <div
                  className="absolute bg-gradient-to-r from-[#501794] to-[#3E70A1] rounded-md shadow-lg p-2"
                  style={{
                    top: `${modalPosition.top - 30}px`, // Positioning the modal based on group position
                    left: `${modalPosition.left - 135}px`, // Offset from the left to avoid overlap
                  }}
                >
                  <Button
                    onClick={() => {
                      // Add logic for leaving the group
                      setShowOptionsForGroup(null)
                    }}
                    className="w-full py-1 px-1 mb-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white hover:bg-gradient-to-l"
                  >
                    <LogOut />
                    Leave Group
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        // Add logic for dissolving the group
                        setShowOptionsForGroup(null)
                      }}
                      className="w-full py-1 px-1 bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white hover:bg-gradient-to-l"
                    >
                      <CircleX />
                      Dissolve
                    </Button>
                  )}
                </div>

              )}
            </DialogPanel>

        </div>
      </div>
    </Dialog>
  )
}

export default ModalListGroup
