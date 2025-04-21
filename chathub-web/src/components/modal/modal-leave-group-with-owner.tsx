"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react"
import Image from "next/image"
import { Images } from "../../constants/images"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import "../../styles/custom-scroll.css"
import { FaRegCircle } from "react-icons/fa"
import { useFriends } from "~/hooks/use-friends"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { ChatDetailSectionResponse, MemberDTO, UserDTO } from "~/codegen/data-contracts"
import { toast } from "react-toastify"
import { useConversation } from "~/hooks/use-converstation"

interface ModalLeaveGroupOwnerProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  conversationId: number
  userId: number
  token: string
  handleReload: () => void
}

const ModalLeaveGroupOwner: React.FC<ModalLeaveGroupOwnerProps> = ({
  isOpen,
  setIsOpen,
  conversationId,
  userId,
  token,
  handleReload,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const { getChatDetailSection, leaveGroupConversation, loading: loadChatDetail } = useConversation(userId, token)
  const [selectedMembers, setSelectedMembers] = useState<MemberDTO>(null)
  const [members, setMembers] = useState<MemberDTO[]>([])

  const fetchChatDetails = async () => {
    if (conversationId && userId && token) {
      const details = await getChatDetailSection(conversationId, userId, token)
      const members = details?.members.filter(m => !m._admin) || []
      setMembers(members)
    }
  }

  useEffect(() => {
    fetchChatDetails()
  }, [conversationId, userId, token])

  const handleTransferAdminAndLeaveGroup = async () => {
    if (!conversationId || !userId || !token) return
    if (!selectedMembers) {
      toast.warning("Please select a member to transfer admin.")
      return
    }
    try {
      setLoading(true)

      const response = await leaveGroupConversation(conversationId, userId, token, selectedMembers.id)
      if (response.statusCode === 200) {
        toast.success("Admin transferred successfully!")
        setIsOpen(false)
        setSelectedMembers(null)
        handleReload()
      } else {
        toast.error("Failed to transfer admin.")
      }
    } catch (error) {
      toast.error("Failed to transfer admin.")
    } finally {
      setLoading(false)
    }
  }

  const [loading, setLoading] = useState(false)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="bg-white rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-xl text-white text-left font-bold leading-6 mb-4 relative">
                <span className="text-[25px] font-bold text-black">Transfer Admin</span>
              </DialogTitle>

              <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 w-10 h-10">
                <Image src={Images.IconCloseModal} alt="close modal" width={40} height={4} />
              </button>

              <hr className="w-full my-4 border-1 border-gray-500 mb-6" />

              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search by phone number or name"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282] focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Search className="h-8 w-8 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pr-2" />
              </div>
              <div className="mt-2 max-h-[50vh] overflow-y-auto custom-scrollbar rounded-lg p-2">
                {loadChatDetail ? (
                  <div>Loading friends...</div>
                ) : (
                  <ul>
                    {members.map((member, index) => (
                      <li
                        key={index}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 space-x-3 transition duration-150 mb-1 cursor-pointer
                          ${selectedMembers === member ? "bg-[#93C1D2]" : "odd:bg-[#E4DEED] even:bg-[#AF9CC9]"}
                          ${selectedMembers !== member ? "hover:rounded-lg bg-[#7a99b8]/90" : ""}
                      `}
                        onClick={() => setSelectedMembers(member)}
                      >
                        <div className="flex items-center gap-x-3">
                          <Image
                            src={member.avatar || Images.AvatarDefault}
                            alt={member.name}
                            width={45}
                            height={45}
                            className="rounded-full"
                          />
                          <div className="text-[#282828]">
                            <p className="font-medium text-sm md:text-base">{member.name}</p>
                            <p className="text-xs text-gray-700 font-normal leading-4">{member.name}</p>
                          </div>
                        </div>

                        <div className="flex space-x-3 text-right font-semibold">
                          {selectedMembers === member ? (
                            <Image src={Images.IconCheckSmall} alt="check icon" width={20} height={20} />
                          ) : (
                            <FaRegCircle size={20} color="gray" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => setIsOpen(false)} className="bg-gray-500 text-white rounded-lg px-5 py-2 mr-2">
                  Cancel
                </Button>

                <Button
                  onClick={handleTransferAdminAndLeaveGroup}
                  className={`bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white rounded-[12px] px-4 py-2 hover:bg-gradient-to-l ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Transfer..." : "Transfer"}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalLeaveGroupOwner
