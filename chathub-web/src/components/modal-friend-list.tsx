"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import React, { Fragment, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import Image from "next/image"
import { Images } from "../constants/images"
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import DropdownFriendList from "./dropdown-friend-list"
import ProfileViewModal from "./modal-profile-view"
import { useFriends } from "~/hooks/use-friends"

interface Friend {
  userId: number
  name: string
  phoneNumber: string
  avatar: string
  online?: boolean
  dateOfBirth?: string
  gender: "Male" | "Female"
}

const friends: Friend[] = [
  { userId: 1, name: "Guy Hawkins", phoneNumber: "0903112233", online: true, avatar: "Images.GuyHawkins", dateOfBirth: "1992-01-01", gender: "Male" },
  { userId: 2, name: "Ronald Richards", phoneNumber: "0902445566", online: true, avatar: "Images.RonaldRichards", dateOfBirth: "1994-02-03", gender: "Male" },
  { userId: 3, name: "Esther Howard", phoneNumber: "0904998877", avatar: "Images.EstherHoward", dateOfBirth: "1995-04-07", gender: "Female" },
  { userId: 4, name: "Albert Flores", phoneNumber: "0905336699", avatar: "Images.AlbertFlores", dateOfBirth: "1998-06-25", gender: "Male" },
  { userId: 5, name: "Miley Cyrus", phoneNumber: "0909225588", avatar: "Images.MileyCyrus", dateOfBirth: "1997-02-17", gender: "Female" },
  { userId: 6, name: "Arlene McCoy", phoneNumber: "0906114477", avatar: "Images.ArleneMcCoy", dateOfBirth: "1993-08-27", gender: "Female" },
  { userId: 7, name: "Cameron Williamson", phoneNumber: "0902115599", avatar: "Images.CameronWilliamson", dateOfBirth: "1996-05-19", gender: "Male" },
]

const ModalFriendList: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const { friends: fetchedFriends, loading, error } = useFriends(userId, token)

  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [isProfileViewModalOpen, setIsProfileViewModalOpen] = useState(false)

  const handleOpenProfile = (friend: Friend) => {
    setSelectedFriend({ ...friend, gender: friend.gender as "Male" | "Female" })
    setIsProfileViewModalOpen(true)
  }

  const filteredFriends = fetchedFriends?.filter(friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase())) || friends

  const friendsToDisplay = activeTab === "recent" ? filteredFriends.filter(friend => friend.online) : filteredFriends

  return (
    <div>
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
                <DialogPanel className="bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-md max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
                    <div className="flex items-center gap-x-2">
                      <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                      <span className="text-[25px] font-bold">Friend List</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                      <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                    </button>
                  </DialogTitle>

                  <hr className="w-full border-gray-500 p-2 mb-3" />

                  <div className="relative mb-4 rounded-lg">
                    <Input
                      type="text"
                      placeholder="Search by phoneNumber number or name"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282] focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Search className="h-8 w-8 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pr-2" />
                  </div>

                  <div className="flex space-x-4 mb-5">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 rounded-lg text-white font-semibold
                                                    ${activeTab === "all"
                          ? "bg-[#501794]"
                          : "bg-[#8C8595] hover:bg-[#7746F5]"
                        }`}
                    >
                      All ({friends.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("recent")}
                      className={`px-4 py-2 rounded-lg text-white font-semibold
                                                    ${activeTab === "recent"
                          ? "bg-[#501794]"
                          : "bg-[#8C8595] hover:bg-[#7746F5]"
                        }`}
                    >
                      Recently online ({friends.filter(friend => friend.online).length})
                    </button>
                  </div>

                  <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
                    {friendsToDisplay.map((friend, index) => (
                      <div
                        key={index}
                        className="flex items-center odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg p-3 mb-3 space-x-3"
                        onClick={() => {
                          setSelectedFriend(friend)
                          setIsDropDownOpen(true)
                        }}
                      >
                        <Image src={friend.avatar} alt={friend.name} width={45} height={45} className="rounded-full" />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="text-black font-medium">{friend.name}</p>
                          </div>
                          <p className="text-gray-600 text-sm">{friend.phoneNumber}</p>
                        </div>

                        <Button className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l">
                          Unfriend
                        </Button>
                        <DropdownFriendList friend={friend} key={index} onOpenProfile={handleOpenProfile} />
                      </div>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ProfileViewModal isOpen={isProfileViewModalOpen} setIsOpen={setIsProfileViewModalOpen} friend={selectedFriend} />
    </div>
  )
}

export default ModalFriendList
