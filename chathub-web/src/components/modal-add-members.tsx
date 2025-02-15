"use client"

import { Fragment, useState } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react"
import Image from "next/image"
import { Images } from "../constants/images"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import "../styles/custom-scroll.css"
import { FaRegCircle } from "react-icons/fa"

interface Member {
  name: string
  phone: string
  image: any
  selected?: boolean
}

const ModalAddMember: React.FC<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onAddMembers: (members: Member[]) => void
}> = ({ isOpen, setIsOpen, onAddMembers }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const [members, setMembers] = useState<Member[]>([
    { name: "Guy Hawkins", phone: "0903112233", image: Images.GuyHawkins, selected: false },
    { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards, selected: false },
    { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, selected: false },
    { name: "Albert Flores", phone: "0905336699", image: Images.AlbertFlores, selected: false },
    { name: "Miley Cyrus", phone: "0909225588", image: Images.MileyCyrus, selected: false },
    { name: "Arlene McCoy", phone: "0906114477", image: Images.ArleneMcCoy, selected: false },
    { name: "Cameron Williamson", phone: "0902115599", image: Images.CameronWilliamson, selected: false },
  ])

  const handleMemberToggle = (index: number) => {
    setMembers(prevMembers => {
      const newMembers = [...prevMembers];
      newMembers[index] = { ...newMembers[index], selected: !newMembers[index].selected };
      return newMembers;
    });
  };

  const filteredMembers = members.filter(member => {
    const searchTerm = searchQuery.toLowerCase()
    return member.name.toLowerCase().includes(searchTerm) || member.phone.includes(searchTerm)
  })

  const handleAddMembers = () => {
    const selectedMembers = members.filter(member => member.selected);
    onAddMembers(selectedMembers);
    setIsOpen(false);
    setMembers(members.map(member => ({ ...member, selected: false })));
  };

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

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-10 h-10 text-gray-400 hover:text-gray-500"
              >
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
                <ul>
                  {filteredMembers.map((member, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg px-3 py-3 space-x-3 transition duration-150 mb-1 cursor-pointer
                          ${member.selected
                          ? "bg-[#93C1D2] even:bg-[#93C1D2] odd:bg-[#93C1D2] rounded-lg"
                          : ""}
                          ${!member.selected && !isOpen
                          ? "even:hover:bg-[#93C1D2] hover:rounded-lg odd:hover:bg-[#93C1D2] rounded-lg "
                          : ""}
                      `}
                      onClick={() => handleMemberToggle(index)}
                    >
                      <div className="flex items-center gap-x-3">
                        <Image src={member.image} alt={member.name} width={45} height={45} className="rounded-full" />
                        <div className="text-[#282828]">
                          <p className="font-medium text-sm md:text-base">{member.name}</p>
                          <p className="text-xs text-gray-700 font-normal leading-4">{member.phone}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3 text-right font-semibold">
                        {member.selected ? (
                          <Image src={Images.IconCheckSmall} alt="check icon" width={20} height={20} />
                        ) : (
                          <FaRegCircle size={20} color="gray" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => setIsOpen(false)} className="bg-gray-500 text-white rounded-lg px-5 py-2 mr-2">
                  Cancel
                </Button>

                <Button
                  onClick={handleAddMembers}
                  className="bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white rounded-[12px] px-4 py-2"
                >
                  Add
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalAddMember
