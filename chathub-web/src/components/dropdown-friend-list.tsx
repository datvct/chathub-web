"use client"

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { Images } from "../constants/images"
import { Ellipsis } from "lucide-react"

interface Friend {
    name: string
    phone: string
    online?: boolean
    image: any
}

const FriendListDropdown: React.FC<{ friend: Friend }> = ({ friend }) => {
    return (
        <Menu as="div" className="relative inline-block text-left gap-y-2">
            <MenuButton as="button">
                <Ellipsis className="w-6 h-6 ml-2 text-[#8994A3] cursor-pointer hover:text-[#3E70A1]" />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    as="ul"
                    className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-gradient-to-r from-[#501794] to-[#3E70A1] ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                    <div className="px-2 py-2">
                        <MenuItem
                            as="li"
                            className="w-full px-3 py-3 text-white flex items-center gap-3 rounded-lg hover:bg-[#431078] hover:bg-opacity-50"
                        >
                            <Image src={Images.IconProfile} alt="Profile" width={20} height={20} className="ml-1" />
                            Profile
                        </MenuItem>

                        <MenuItem
                            as="li"
                            className="w-full px-3 py-3 text-white flex items-center gap-3 rounded-lg hover:bg-[#431078] hover:bg-opacity-50"
                        >
                            <Image src={Images.IconMessage} alt="Message" width={20} height={20} className="ml-1" />
                            Message
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    )
}

export default FriendListDropdown
