import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Images } from "../../constants/images"
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react"
import { Search, EllipsisVertical } from "lucide-react"
import "../../styles/custom-scroll.css"
import { LogOut } from "lucide-react"
import { CircleX } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { useConversation } from "~/hooks/use-converstation"
import { ConversationResponse } from "~/codegen/data-contracts"

interface ModalListGroupProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isAdmin: boolean
  userId?: number
  token?: string
}

const ModalListGroup: React.FC<ModalListGroupProps> = ({ isOpen, setIsOpen, isAdmin, userId, token }) => {
  const [dataGroup, setDataGroup] = useState<ConversationResponse[]>([])
  const [groupName, setGroupName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const { groups: fetchedGroups, findGroups, getRecentConversation } = useConversation(userId, token)

  const groupRefs = useRef<(HTMLLIElement | null)[]>([])

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [showOptionsForGroup, setShowOptionsForGroup] = useState<number | null>(null)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (userId) {
      const init = async () => {
        const response = await getRecentConversation(userId, token)
        if (response) {
          const groupConversations = response.filter(group => group.chatType === "GROUP")
          setDataGroup(groupConversations)
        }
      }
      init()
    }
  }, [isOpen])

  const handleEllipsisClick = (index: number) => {
    if (showOptionsForGroup === index) {
      setShowOptionsForGroup(null)
    } else {
      setShowOptionsForGroup(index)
      const groupElement = groupRefs.current[index]
      if (groupElement) {
        const rect = groupElement.getBoundingClientRect()
        setModalPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        })
      }
    }
  }

  const filteredGroups =
    dataGroup?.filter(group => {
      const term = searchTerm.toLowerCase()
      return group.groupName?.toLowerCase().includes(term)
    }) || []

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
          <DialogPanel className="overflow-visible bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform p-6 text-left align-middle shadow-xl transition-all">
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
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
              />
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pr-2" />
            </div>
            <Button
              className={`w-20 py-2 px-4 mb-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l
              ${activeTab === "all" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}
            `}
            >
              All ({dataGroup?.length || 0})
            </Button>

            <ul className="max-h-[55vh] overflow-auto custom-scrollbar">
              {dataGroup.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <li
                    key={group.id}
                    ref={el => {
                      groupRefs.current[index] = el
                    }}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-3 ${
                      selectedGroup === index ? "bg-[#7a99b8]/90" : ""
                    } bg-[#fff] hover:bg-[#93C1D2]`}
                  >
                    <Image
                      src={group.groupAvatar ?? Images.AvatarDefault}
                      alt={group.groupName ?? "Group Avatar"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-black">{group.groupName || "Unnamed Group"}</p>
                      <p className="text-sm text-gray-700">{group.lastMessage || "No messages yet"}</p>
                    </div>
                    <EllipsisVertical
                      className="ml-auto text-gray-500"
                      onClick={() => {
                        handleEllipsisClick(index)
                      }}
                    />
                  </li>
                ))
              ) : (
                <p className="text-white">No groups found</p>
              )}
            </ul>

            {/* Modal for Leave Group / Dissolve */}
            {showOptionsForGroup !== null && modalPosition && (
              <div
                className="absolute bg-gradient-to-r from-[#501794] to-[#3E70A1] rounded-md shadow-lg p-2"
                style={{
                  top: `${modalPosition.top - 30}px`,
                  left: `${modalPosition.left - 135}px`,
                }}
              >
                <Button
                  onClick={() => {
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
