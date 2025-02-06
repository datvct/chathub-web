"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import React, { Fragment, useState } from "react"
import Image from "next/image"
import { Images } from "../constants/images"
import { Search, Ellipsis } from "lucide-react";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import FriendListDialog from "./dialog-friend-list"

interface Friend {
    name: string
    phone: string
    online?: boolean
    image: any
}

const friends: Friend[] = [
    { name: "Guy Hawkins", phone: "0903112233", online: true, image: Images.GuyHawkins },
    { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards },
    { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward },
    { name: "Albert Flores", phone: "0905336699", image: Images.AlbertFlores },
    { name: "Miley Cyrus", phone: "0909225588", image: Images.MileyCyrus },
    { name: "Arlene McCoy", phone: "0906114477", image: Images.ArleneMcCoy },
    { name: "Cameron Williamson", phone: "0902115599", image: Images.CameronWilliamson },
]

const ModalFriendList: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredFriends = friends.filter(friend => {
        if (searchTerm === "") {
            return true 
        } else {
            return friend.name.toLowerCase().includes(searchTerm.toLowerCase()) || friend.phone.includes(searchTerm)
        }
    })

    const friendsToDisplay = activeTab === "recent" ? filteredFriends.filter(friend => friend.online) : filteredFriends

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
                            <DialogPanel className="w-[500px] h-[800px] rounded-[30px] transform overflow-hidden bg-[#385068] p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center mb-2">
                                    <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                                    <DialogTitle className="text-2xl font-bold text-white ml-3 leading-6">
                                        <span className="text-[25px] font-bold">Friend List</span>
                                    </DialogTitle>
                                </div>

                                <hr className="w-full border-gray-500 p-2 mb-3" />

                                <div className="relative mb-4 rounded-lg">
                                    <Input
                                        type="text"
                                        placeholder="Search by phone number or name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full py-[22px] pl-12 pr-4 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282] focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <Search className="h-8 w-8 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pr-2" />
                                </div>

                                <div className="flex space-x-4 mb-5">
                                    <button
                                        onClick={() => setActiveTab("all")}
                                        className={`px-4 py-2 rounded-lg text-white font-semibold 
                                                    ${activeTab === "all" ? "bg-[#501794]" : "bg-[#404145] hover:bg-[#7746F5]"
                                                }`}
                                    >
                                        All ({friends.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("recent")}
                                        className={`px-4 py-2 rounded-lg text-white font-semibold 
                                                    ${activeTab === "recent" ? "bg-[#501794]" : "bg-[#404145] hover:bg-[#7746F5]"
                                                }`}
                                    >
                                        Recently online ({friends.filter(friend => friend.online).length})
                                    </button>
                                </div>

                                <div className="h-[530px] overflow-y-auto custom-scrollbar pr-2">
                                    {friendsToDisplay.map((friend, index) => (
                                        <div key={index} 
                                            className="flex items-center odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg p-3 mb-3 space-x-3"
                                            onClick={() => {setSelectedFriend(friend); setIsDialogOpen(true)}}>
                                                <Image src={friend.image} alt={friend.name} width={45} height={45} className="rounded-full" />

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <p className="text-black font-medium">{friend.name}</p>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">{friend.phone}</p>
                                                </div>

                                                <Button className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l">
                                                    Unfriend
                                                </Button>
                                                <Ellipsis className="w-6 h-6 ml-2 text-[#8994A3] cursor-pointer hover:text-[#3E70A1]" />
                                        </div>
                                    ))}

                                    <FriendListDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} friend={selectedFriend!} /> 
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalFriendList
