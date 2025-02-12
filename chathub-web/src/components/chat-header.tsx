import Image from "next/image"
import { FaPhoneAlt } from "react-icons/fa"
import { IoSearch } from "react-icons/io5"
import { IoMdVideocam, IoMdMore } from "react-icons/io"
import { Images } from "~/constants/images"
const ChatHeader = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center justify-between space-x-3 mb-4 border-b border-white pb-4">
      <div className="flex items-center flex-col">
        <div className="flex items-center gap-3">
          <Image
            src={Images.AvatarDefault}
            alt={name}
            className="w-[3.125rem] h-[3.125rem] rounded-[30px]"
            width={50}
            height={50}
          />
          <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-sm text-gray-400">Active 3m ago</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <button className="bg-[#484848] h-10 w-10 rounded-[20px] flex items-center justify-center">
          <IoSearch size={20} color="white" className="text-white" />
        </button>
        <button className="bg-[#484848] h-10 w-10 rounded-[20px] flex items-center justify-center">
          <FaPhoneAlt size={20} color="white" className="text-white" />
        </button>
        <button className="bg-[#484848] h-10 w-10 rounded-[20px] flex items-center justify-center">
          <IoMdVideocam size={20} color="white" className="text-white" />
        </button>
        <button className="bg-[#484848] h-10 w-10 rounded-[20px] flex items-center justify-center">
          <IoMdMore size={20} color="white" className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
