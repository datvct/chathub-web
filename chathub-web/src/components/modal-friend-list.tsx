"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { Images } from "../constants/images"
import { Input } from "./ui/input"
import "../styles/custom-scroll.css"


const ModalFriendList: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const friends = [
        { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards, online: false },
        { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, online: true },
        { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, online: false },
        { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards, online: false },
        { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, online: false },
        { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards, online: false },
        { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, online: false },
    ]

    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<"all" | "online">("all")

    const filteredFriends = friends.filter(friend => {
        if (filter === "online" && !friend.online) {
            return false
        }
        const searchTerm = searchQuery.toLowerCase()
        return friend.name.toLowerCase().includes(searchTerm) || friend.phone.includes(searchTerm)
    })

    const onlineCount = friends.filter(friend => friend.online).length

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4 text-center">
                                    <div className="text-[20px] font-bold flex flex-row justify-between px-8 mb-4">
                                        Friend List
                                        <button onClick={() => setIsOpen(false)}>
                                            {" "}
                                            <Image src={Images.IconClosePurple} alt="close" width={24} height={24} />
                                        </button>
                                    </div>
                                </Dialog.Title>

                                <div className="relative">
                                    <div className="absolute top-3 left-3">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Search by phone number or name"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10 w-full p-2.5 focus:ring-sky-500
                                focus:border-sky-500 bg-white border-2
                                border-[#C7CACF] rounded-2xl text-[14px]"
                                    />
                                </div>

                                <div className="mt-4 flex space-x-4 rounded-lg shadow-md mb-6 p-1">
                                    <button
                                        onClick={() => setFilter("all")}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${filter === "all" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-purple-50"
                                            }`}
                                    >
                                        All ({friends.length})
                                    </button>

                                    <button
                                        onClick={() => setFilter("online")}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${filter === "online" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-purple-50"
                                            }`}
                                    >
                                        Recently online ({onlineCount})
                                    </button>
                                </div>
                                <div className="custom-scrollbar max-h-[400px] overflow-y-auto w-full rounded-lg">
                                    {" "}
                                    {/* Make scrollable, ensure appropriate height */}
                                    <ul>
                                        {filteredFriends.map((friend, index) => (
                                            <li
                                                key={index}
                                                className={`mb-3 rounded-lg px-3 py-2.5 ${index === 2 ? "bg-white shadow" : "bg-[#eee]"
                                                    } hover:bg-gray-100 `}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-row items-center space-x-3">
                                                        <Image src={friend.image} alt="avatar" width={40} height={40} className="rounded-full" />
                                                        <div>
                                                            <h4 className="text-[15px] font-medium">{friend.name}</h4>
                                                            <p className="text-xs text-gray-500">{friend.phone}</p>
                                                        </div>

                                                        {friend.online && (
                                                            <span className="w-[12px] h-[12px] bg-green-500 rounded-full mr-2 border-[#fff] border-[1.25px]" />
                                                        )}
                                                    </div>

                                                    <div className="space-x-2">
                                                        {" "}
                                                        {/* Button container for better hover effects */}
                                                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition duration-150">
                                                            Unfriend
                                                        </button>
                                                        <button>
                                                            <svg
                                                                className="w-[20px] text-[#6F767E]"
                                                                stroke="currentColor"
                                                                fill="none"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <circle cx="12" cy="12" r="1" />
                                                                <circle cx="19" cy="12" r="1" />
                                                                <circle cx="5" cy="12" r="1" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalFriendList
