"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react"
import Image from "next/image"
import { Images } from "../constants/images"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import "../styles/custom-scroll.css"
import { FaRegCircle } from "react-icons/fa"
import { useFriends } from "~/hooks/use-friends"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import { UserDTO } from "~/codegen/data-contracts"
import { useConversation } from "~/hooks/use-converstation"
import { toast } from "react-toastify"

interface ModalAddMembersProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  conversationId: number
  onMembersAdded: () => void
}

const ModalAddMembers: React.FC<ModalAddMembersProps> = ({ isOpen, setIsOpen, conversationId, onMembersAdded }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const { friends, loading: friendsLoading, error: friendsError } = useFriends(userId!, token!)
  const { addMembersToConversation, loading: addMembersLoading } = useConversation()
  const [selectedMembers, setSelectedMembers] = useState<UserDTO[]>([])

  useEffect(() => {
    setSelectedMembers([])
  }, [isOpen])

  const handleMemberToggle = (member: UserDTO) => {
    setSelectedMembers(prevMembers => {
      const isMemberSelected = prevMembers.some(m => m.id === member.id)
      if (isMemberSelected) {
        return prevMembers.filter(m => m.id !== member.id)
      } else {
        return [...prevMembers, member]
      }
    })
  }

  const filteredMembers =
    friends?.filter(member => {
      if (!member) return false
      const searchTerm = searchQuery.toLowerCase()
      return member.name?.toLowerCase().includes(searchTerm) || member.phoneNumber?.includes(searchTerm)
    }) || []

  const handleAddMembersToGroup = async () => {
    if (!conversationId || !userId || !token) return
    if (selectedMembers.length === 0) {
      toast.warning("Please select members to add.")
      return
    }

    try {
      const memberIdsToAdd = selectedMembers.map(member => member.id || 0).filter(id => id !== 0)
      if (memberIdsToAdd.length === 0) {
        toast.warning("Please select valid members to add.")
        return
      }

      const success = await addMembersToConversation(conversationId, memberIdsToAdd, token)
      if (success) {
        toast.success("Members added to group successfully!")
        setIsOpen(false)
        onMembersAdded()
      } else {
        toast.error("Failed to add members to group.")
      }
    } catch (error) {
      console.error("Error adding members to conversation:", error)
      toast.error("Failed to add members to group.")
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-xl text-white text-left font-bold leading-6 mb-4 relative">
                <span className="text-[25px] font-bold">Add member</span>
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
                {friendsLoading ? (
                  <div>Loading friends...</div>
                ) : friendsError ? (
                  <div>Error loading friends: {friendsError}</div>
                ) : filteredMembers.length === 0 ? (
                  <div>No friends found.</div>
                ) : (
                  <ul>
                    {filteredMembers.map((member, index) => (
                      <li
                        key={index}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 space-x-3 transition duration-150 mb-1 cursor-pointer
                          ${selectedMembers.some(m => m.id === member.id)
                            ? "bg-[#93C1D2]"
                            : "odd:bg-[#E4DEED] even:bg-[#AF9CC9]"
                          }
                          ${!selectedMembers.some(m => m.id === member.id) ? "hover:rounded-lg bg-[#7a99b8]/90" : ""}
                      `}
                        onClick={() => handleMemberToggle(member)}
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
                            <p className="text-xs text-gray-700 font-normal leading-4">{member.phoneNumber}</p>
                          </div>
                        </div>

                        <div className="flex space-x-3 text-right font-semibold">
                          {selectedMembers.some(m => m.id === member.id) ? (
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
                  onClick={handleAddMembersToGroup}
                  className={`bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white rounded-[12px] px-4 py-2 hover:bg-gradient-to-l ${addMembersLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={addMembersLoading}
                >
                  {addMembersLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalAddMembers
