"use client"
import Image from "next/image"
import { Images } from "~/constants/images"
import { GoBell } from "react-icons/go"
import { BsPinAngleFill } from "react-icons/bs"
import { FaRegFile } from "react-icons/fa"
import { FaLink } from "react-icons/fa6"
import { MdBlock } from "react-icons/md"
import { CgTrashEmpty } from "react-icons/cg"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoSettingsOutline } from "react-icons/io5"
import { LuUserRound } from "react-icons/lu"
import { HiOutlineArrowRightEndOnRectangle } from "react-icons/hi2"
import ModalLeaveGroup from "./modal-leave-group"
import { FaChevronLeft } from "react-icons/fa6"
import { Button } from "./ui/button"
import { LuUserRoundPlus } from "react-icons/lu"
import ModalAddMembers from "./modal-add-members" // Adjust path if needed
import ModalDissolveGroup from "./modal-dissolve-group"
import { useState } from "react"

interface Member {
  name: string
  phone: string
  image: any
  selected?: boolean
}

const ChatInfo = ({
  isOpen,
  isGroupChat,
  selectedChat,
}: {
  isOpen?: boolean
  isGroupChat?: boolean
  selectedChat: number
}) => {
  const [isOpenLeaveGroup, setIsOpenLeaveGroup] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false) // Thêm state này
  const [isOpenAddMembers, setIsOpenAddMembers] = useState(false)
  const [isOpenDissolveGroup, setIsOpenDissolveGroup] = useState(false)

  if (!isOpen) return null
  const [groupMembers, setGroupMembers] = useState<Member[]>([
    { name: "Guy Hawkins", phone: "0903112233", image: Images.GuyHawkins, selected: false },
    { name: "Ronald Richards", phone: "0902445566", image: Images.RonaldRichards, selected: false },
    { name: "Esther Howard", phone: "0904998877", image: Images.EstherHoward, selected: false },
    { name: "Albert Flores", phone: "0905336699", image: Images.AlbertFlores, selected: false },
    { name: "Miley Cyrus", phone: "0909225588", image: Images.MileyCyrus, selected: false },
    { name: "Arlene McCoy", phone: "0906114477", image: Images.ArleneMcCoy, selected: false },
    { name: "Cameron Williamson", phone: "0902115599", image: Images.CameronWilliamson, selected: false },
  ])

  const handleAddMembers = (members: Member[]) => {
    // setSelectedMembers(members)
    setGroupMembers([...groupMembers, ...members])
    setIsAddingMember(false)
  }

  return (
    <div className="bg-[#292929] text-white h-screen overflow-hidden overflow-y-auto w-1/4 p-4">
      {!isAddingMember ? (
        <>
          <div className="flex justify-center items-center">
            <h2 className="text-2xl text-center font-semibold">Conversation Info</h2>
          </div>
          <div className="mt-4 rounded-lg ">
            <div className="flex justify-between items-center flex-col gap-4">
              <div className="flex flex-col items-center">
                <Image
                  src={Images.ImageDefault}
                  className="w-20 h-20 rounded-full"
                  alt="Avatar"
                  width={80}
                  height={80}
                />
                <p className="mt-2 text-lg font-semibold">Name</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center flex-col">
                  <button className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center">
                    <GoBell size={20} color="white" className="text-white" />
                  </button>
                  <span>Mute</span>
                </div>
                {isGroupChat && (
                  <div className="flex items-center flex-col">
                    <button
                      className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
                      onClick={() => setIsAddingMember(true)}
                    >
                      <AiOutlineUsergroupAdd size={25} color="white" className="text-white" />
                    </button>
                    <span className="whitespace-nowrap">Add Member</span>
                  </div>
                )}
                <div className="flex items-center flex-col">
                  <button className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center">
                    <BsPinAngleFill size={20} color="white" className="text-white" />
                  </button>
                  <span className="whitespace-nowrap">Pin</span>
                </div>
                {isGroupChat && (
                  <div className="flex items-center flex-col">
                    <button className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center">
                      <IoSettingsOutline size={20} color="white" className="text-white" />
                    </button>
                    <span className="whitespace-nowrap">Manage group</span>
                  </div>
                )}
              </div>
            </div>

            {isGroupChat && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Group Member</h3>
                <button className="mt-3 px-3 w-full flex gap-2" onClick={() => setIsAddingMember(true)}>
                  <LuUserRound size={20} color="white" />
                  <span>5 Memebers</span>
                </button>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-md font-semibold">Photos/ Videos</h3>
              <div className="grid grid-cols-4 gap-x-2 gap-y-4 mt-3 px-2">
                {[...Array(8)].map((_, i) => (
                  <Image
                    key={i}
                    src={Images.ImageDefault}
                    className="w-20 h-20 object-cover"
                    alt="Media"
                    width={80}
                    height={80}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold">File</h3>
              <div className="flex flex-col gap-3 mt-3 px-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <FaRegFile size={40} color="white" className="text-white" />
                      <div>
                        <p className="text-lg">File Name</p>
                        <p className="text-xs text-[#838383]">1.2 MB</p>
                      </div>
                    </div>
                    <div className="text-sm text-[#838383]">12/01/2025</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold">Link</h3>
              <div className="flex flex-col gap-3 mt-3 px-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <FaLink size={40} color="white" className="text-white" />
                      <div>
                        <p className="text-lg">File Name</p>
                        <p className="text-xs text-[#838383]">1.2 MB</p>
                      </div>
                    </div>
                    <div className="text-sm text-[#838383]">12/01/2025</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold">Privacy settings</h3>
              <div className="flex flex-col gap-3 mt-3 px-2">
                {isGroupChat ? (
                  <button className="flex items-center gap-3" onClick={() => setIsOpenLeaveGroup(true)}>
                    <HiOutlineArrowRightEndOnRectangle size={25} color="red" className="font-semibold" />
                    <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">Leave group</span>
                  </button>
                ) : (
                  <button className="flex items-center gap-3">
                    <MdBlock size={25} color="white" className="text-white font-semibold" />
                    <span className="text-sm font-semibold leading-[25px]">Block</span>
                  </button>
                )}
                <button className="flex items-center gap-3" onClick={() => setIsOpenDissolveGroup(true)}>
                  <HiOutlineArrowRightEndOnRectangle size={25} color="red" className="font-semibold" />
                  <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">Dissolve Group</span>
                </button>
                <button className="flex items-center gap-3" onClick={() => setIsOpenLeaveGroup(true)}>
                  <CgTrashEmpty size={25} color="red" className="text-red font-semibold" />
                  <span className="text-sm font-semibold leading-[25px] text-[#FF0000]">Delete chat history</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <button className="text-left" onClick={() => setIsAddingMember(false)}>
              <FaChevronLeft size={20} color="white" />
            </button>
            <div className="text-2xl ml-[35%] text-center font-semibold flex justify-center">
              <span>Memeber</span>
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full bg-[#D9D9D9] hover:bg-white" onClick={() => setIsOpenAddMembers(true)}>
              <LuUserRoundPlus size={30} color="black" />
              <span className="text-black text-sm">Add member</span>
            </Button>
            <div className="mt-4">List memeber (5)</div>
            <div className="mt-3 px-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Image
                    src={Images.AvatarDefault}
                    alt={"avatar"}
                    className="w-[3.125rem] h-[3.125rem] rounded-[30px]"
                    width={50}
                    height={50}
                  />
                  <span>Member {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isOpenAddMembers && (
        <ModalAddMembers isOpen={isOpenAddMembers} setIsOpen={setIsOpenAddMembers} onAddMembers={handleAddMembers} />
      )}
      {isOpenLeaveGroup && (
        <ModalLeaveGroup isOpen={isOpenLeaveGroup} setIsOpen={setIsOpenLeaveGroup} chatId={selectedChat} />
      )}
      {isOpenDissolveGroup && (
        <ModalDissolveGroup isOpen={isOpenDissolveGroup} setIsOpen={setIsOpenDissolveGroup} chatId={selectedChat} />
      )}
    </div>
  )
}

export default ChatInfo
