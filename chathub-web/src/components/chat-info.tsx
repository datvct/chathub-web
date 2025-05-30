"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "react-toastify"
import { ChatDetailSectionResponse, UserDTO, MemberDTO } from "~/codegen/data-contracts"
import { getRecentConversationByUserID } from "~/lib/get-conversation"
import { Images } from "~/constants/images"
import { useConversation } from "~/hooks/use-converstation"
import { useBlockUnblockUser } from "~/hooks/use-user"
import { GrUserAdmin } from "react-icons/gr"
import ModalLeaveGroup from "./modal/modal-leave-group"
import ModalAddMembers from "./modal/modal-add-members"
import ModalDissolveGroup from "./modal/modal-dissolve-group"
import ModalUpdateGroupInfo from "./modal/modal-update-group-info"
import ModalConfirm from "./modal/modal-confirm"
import ModalSuccess from "./modal/modal-success"
import ModalDeleteConversation from "~/components/modal/modal-delete-conversation"
import ModalUpdateNickname from "./modal/modal-update-nickname"
import ProfileViewModal from "./modal/modal-profile-view"
import ModalImageViewer from "./modal/modal-image-viewer"

import { Button } from "./ui/button"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"

import { GoBell, GoBellSlash, GoPencil } from "react-icons/go"
import { BsPinAngleFill } from "react-icons/bs"
import { RiUnpinFill } from "react-icons/ri"
import { FaRegFile } from "react-icons/fa"
import { FaLink, FaTrashAlt } from "react-icons/fa"
import { FaUserSlash } from "react-icons/fa6"
import { MdBlock, MdLockOpen, MdGroupRemove } from "react-icons/md"
import { CgTrashEmpty } from "react-icons/cg"
import { AiOutlineUsergroupAdd, AiOutlineEdit } from "react-icons/ai"
import { HiOutlineArrowRightEndOnRectangle } from "react-icons/hi2"
import { FaChevronLeft } from "react-icons/fa6"
import { LuUserRoundPlus, LuShieldCheck } from "react-icons/lu"
import { TbUserEdit } from "react-icons/tb"
import { IoSettingsOutline, IoEllipsisVertical, IoClose } from "react-icons/io5"
import { cn } from "~/lib/utils"
import { RoleGroup } from "~/types/types"
import ModalConfirmDeputy from "./modal/modal-confirm-deputy"
import ModalLeaveGroupOwner from "./modal/modal-leave-group-with-owner"

interface ChatInfoProps {
  isOpen?: boolean
  isGroupChat?: boolean
  selectedChat: number
  setIsChatInfoOpen: (isOpen: boolean) => void
  onPinChange: (isPinned: boolean) => void
  onHistoryDeleted: () => void
  onChatInfoUpdated: () => void
  handleReloadTrigger: () => void
  userId?: number
  token?: string
}

const ChatInfo = ({
  isOpen,
  isGroupChat,
  selectedChat,
  setIsChatInfoOpen,
  onPinChange,
  onHistoryDeleted,
  onChatInfoUpdated,
  handleReloadTrigger,
  userId,
  token,
}: ChatInfoProps) => {
  const router = useRouter()

  const {
    getChatDetailSection,
    removeParticipantFromGroup,
    pinConversation,
    leaveGroupConversation,
    dissolveGroupConversation,
    grantDeputyGroup,
    revokeDeputy,
    loading: conversationLoading,
    error: conversationError,
  } = useConversation(userId, token)
  const { blockUser, unblockUser, loading: blockUnblockLoading } = useBlockUnblockUser(userId, token)
  const [view, setView] = useState<"main" | "members">("main")
  const [chatDetail, setChatDetail] = useState<ChatDetailSectionResponse | null>(null)
  const [isPinned, setIsPinned] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmModalProps, setConfirmModalProps] = useState({ title: "", message: "", onConfirm: () => {} })
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isOpenAddMembers, setIsOpenAddMembers] = useState(false)
  const [isOpenUpdateGroupInfo, setIsOpenUpdateGroupInfo] = useState(false)
  const [isOpenDeleteConversation, setIsOpenDeleteConversation] = useState(false)
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false)
  const [isProfileViewModalOpen, setIsProfileViewModalOpen] = useState(false)
  const [selectedFriendForView, setSelectedFriendForView] = useState<UserDTO | null>(null)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [selectedImageUrlForInfo, setSelectedImageUrlForInfo] = useState<string | null>(null)
  const [memberToAction, setMemberToAction] = useState<MemberDTO | null>(null)
  const [actionType, setActionType] = useState<"remove" | "updateNickname" | null>(null)
  const [isOpenGrantDeputyModalOpen, setIsOpenGrantDeputyModalOpen] = useState(false)
  const [isOpenRevokeDeputyModalOpen, setIsOpenRevokeDeputyModalOpen] = useState(false)
  const [selectDeputyId, setSelectDeputyId] = useState<number | null>(null)
  const [isOpenLeaveGroupOwner, setIsOpenLeaveGroupOwner] = useState(false)

  const isCurrentUserAdmin = chatDetail?.members?.find(m => m.id === userId)?._admin ?? true
  const isDeputy = chatDetail?.members?.find(m => m.id === userId)?.role === "DEPUTY"
  const otherMember = chatDetail?.members?.find(m => m.id !== userId)
  const [imagesAndVideos, setImagesAndVideos] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])

  const handleAvatarClickInInfo = (imageUrl: string | undefined | null) => {
    if (imageUrl) {
      setSelectedImageUrlForInfo(imageUrl)
      setIsImageViewerOpen(true)
    } else {
      toast.info("No avatar available to view.")
    }
  }

  const fetchChatDetails = async () => {
    if (selectedChat && userId && token) {
      const details = await getChatDetailSection(selectedChat, userId, token)

      setChatDetail(details || null)

      const media = details.list_media || []
      setImagesAndVideos(media.filter(item => item.type === "IMAGE" || item.type === "VIDEO"))
      setFiles(media.filter(item => item.type === "DOCUMENT"))
      setLinks(media.filter(item => item.type === "LINK"))

      try {
        const convos = await getRecentConversationByUserID(userId, token)
        const currentConvo = convos.find(c => c.id === selectedChat)
        setIsPinned(currentConvo?.pinned ?? false)
      } catch (e) {}

      setIsBlocked(details?.type === "SINGLE" && details.members?.length === 2 ? false : false)
    }
  }

  useEffect(() => {
    if (isOpen && selectedChat) {
      setView("main")
      fetchChatDetails()
    } else {
      setChatDetail(null)
      setIsPinned(false)
      setIsBlocked(false)
      setMemberToAction(null)
      setActionType(null)
    }
  }, [isOpen, selectedChat, userId, token])

  const openConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalProps({ title, message, onConfirm })
    setIsConfirmModalOpen(true)
  }

  const handleNicknameUpdated = () => {
    setIsNicknameModalOpen(false)
    fetchChatDetails()
    onChatInfoUpdated()
  }

  const handleOpenUpdateNicknameModal = (member: MemberDTO) => {
    if (member && member.id) {
      setMemberToAction(member)
      setActionType("updateNickname")
      setIsNicknameModalOpen(true)
    } else {
      toast.error("Could not open nickname editor for this member.")
    }
  }

  const handlePinToggle = async () => {
    if (!selectedChat || !userId || !token) return
    const newPinState = !isPinned
    try {
      const pinSuccess = await pinConversation(selectedChat, userId, newPinState, token)
      if (pinSuccess) {
        setIsPinned(newPinState)
        onPinChange(newPinState)
        toast.success(`Conversation ${newPinState ? "pinned" : "unpinned"} successfully!`)
        onChatInfoUpdated()
      } else {
        toast.error("Failed to update pin status.")
      }
    } catch (error) {
      toast.error("Failed to update pin status.")
    }
  }

  const handleRemoveMemberAction = (member: MemberDTO) => {
    setMemberToAction(member)
    setActionType("remove")
    openConfirmModal("Remove Member", `Are you sure you want to remove ${member.name} from the group?`, async () => {
      if (!selectedChat || !userId || !token || !member.id) {
        toast.error("Invalid data to remove member.")
        return
      }
      try {
        const response = await removeParticipantFromGroup(selectedChat, userId, member.id, token)
        if (response?.statusCode === 200) {
          toast.success("Member removed successfully!")
          setSuccessMessage("Member removed successfully!")
          handleReloadViewMemeber()
          setIsConfirmModalOpen(false)
        } else {
          toast.error(response?.message || "Failed to remove member.")
        }
      } catch (error) {
        toast.error("Failed to remove member. Please try again.")
      }
    })
  }

  const handleOpenProfileView = (member: MemberDTO) => {
    if (!member || !member.id) {
      toast.error("Cannot view profile for this member.")
      return
    }
    const friendData: UserDTO = {
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      phoneNumber: member.phoneNumber,
    }
    setSelectedFriendForView(friendData)
    setIsProfileViewModalOpen(true)
  }

  const handleLeaveGroupAction = () => {
    if (isCurrentUserAdmin && otherMember) {
      setIsOpenLeaveGroupOwner(true)
    } else {
      openConfirmModal("Leave Group", "Are you sure you want to leave this group?", async () => {
        if (!selectedChat || !userId || !token) return
        try {
          const response = await leaveGroupConversation(selectedChat, userId, token)
          if (response?.statusCode === 200) {
            handleReloadTrigger()
            toast.success("Left group successfully!")
            setIsChatInfoOpen(false)
            onHistoryDeleted()
            router.push("/")
          } else {
            toast.error(response?.message || "Failed to leave group.")
          }
        } catch (error: any) {
          toast.error("Failed to leave group.")
        }
      })
    }
  }

  const handleDissolveGroupAction = () => {
    openConfirmModal(
      "Dissolve Group",
      "Are you sure you want to dissolve this group? This action cannot be undone.",
      async () => {
        if (!selectedChat || !userId || !token) return
        try {
          const response = await dissolveGroupConversation(selectedChat, userId, token)
          if (response?.statusCode === 200) {
            handleReloadTrigger()
            toast.success("Group dissolved successfully!")
            setIsChatInfoOpen(false)
            onHistoryDeleted()
            router.push("/")
          } else {
            toast.error(response?.message || "Failed to dissolve group.")
          }
        } catch (error) {
          toast.error("An error occurred while dissolving the group.")
        }
      },
    )
  }

  const handleDeleteConversationAction = () => {
    setIsOpenDeleteConversation(true)
  }

  const handleBlockToggle = async () => {
    if (chatDetail?.type !== "SINGLE" || !otherMember?.id || !userId || !token) return
    const action = isBlocked ? unblockUser : blockUser
    const actionName = isBlocked ? "Unblocking" : "Blocking"
    const successMessage = `User ${isBlocked ? "unblocked" : "blocked"} successfully!`
    const errorMessage = `Failed to ${isBlocked ? "unblock" : "block"} user.`

    try {
      const response = await action(userId, otherMember.id, token)

      if (response) {
        toast.success(successMessage)
        setIsBlocked(!isBlocked)
        onChatInfoUpdated()
      } else {
        const apiError = response?.data?.message || errorMessage
        toast.error(apiError)
      }
    } catch (error) {
      toast.error(errorMessage)
    }
  }

  const sortedMembers = [...(chatDetail?.members || [])].sort((a, b) => {
    return RoleGroup[a.role] - RoleGroup[b.role]
  })

  const handleDeputy = (memberId: number, type: "grant" | "revoke") => {
    if (type === "grant") {
      setIsOpenGrantDeputyModalOpen(true)
      setSelectDeputyId(memberId)
    } else {
      setIsOpenRevokeDeputyModalOpen(true)
      setSelectDeputyId(memberId)
    }
  }

  const handleReloadViewMemeber = () => {
    setChatDetail(null)
    fetchChatDetails()
  }

  const renderMemberItem = (member: MemberDTO) => (
    <div key={member.id} className="flex items-center justify-between py-3 px-2 hover:bg-gray-700 rounded-lg">
      <div
        className="flex items-center gap-3 flex-1 min-w-0"
        onClick={() => handleOpenProfileView(member)}
        style={{ cursor: "pointer" }}
      >
        <Image
          src={member.avatar || Images.AvatarDefault}
          alt={member.name || "Member"}
          width={40}
          height={40}
          className="rounded-full w-10 h-10 flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate flex flex-col">
            <span>
              {member.name || "Unknown Member"}
              {member.id === userId && <span className="text-xs text-gray-400 ml-1">(You)</span>}
            </span>
            {member._admin && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <GrUserAdmin size={14} className="text-yellow-400 flex-shrink-0" title="Admin" />
                <span className="text-xs text-gray-400">Admin</span>
              </span>
            )}
            {member.role === "DEPUTY" && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <GrUserAdmin size={14} className="text-gray-400 flex-shrink-0" title="Admin" />
                <span className="text-xs text-gray-400">Deputy</span>
              </span>
            )}
          </p>
        </div>
      </div>

      {member.id !== userId && (
        <Menu as="div" className="relative flex-shrink-0">
          <MenuButton as="button" className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-600">
            <IoEllipsisVertical size={20} />
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
            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-600 rounded-md bg-[#3a3a3a] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1">
                {isCurrentUserAdmin && member.role !== "DEPUTY" && (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => handleDeputy(member.id, "grant")}
                        className={`
                        ${active ? "bg-gray-600" : ""}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm text-white
                      `}
                      >
                        <GrUserAdmin size={14} className="text-white flex-shrink-0 mr-2" title="Admin" />
                        Grant deputy
                      </button>
                    )}
                  </MenuItem>
                )}

                {isCurrentUserAdmin && member.role === "DEPUTY" && (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => handleDeputy(member.id, "revoke")}
                        className={`
                        ${active ? "bg-gray-600" : ""}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm text-white
                      `}
                      >
                        <GrUserAdmin size={14} className="text-white flex-shrink-0 mr-2" title="Admin" />
                        Revoke deputy
                      </button>
                    )}
                  </MenuItem>
                )}

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleOpenProfileView(member)}
                      className={`
                        ${active ? "bg-gray-600" : ""}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm text-white
                      `}
                    >
                      <Image src={Images.IconEye} alt="Icon Eye" width={28} height={28} className="mr-2 h-4 w-4" />
                      View Profile
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => handleOpenUpdateNicknameModal(member)}
                      className={`
                        ${active ? "bg-gray-600" : ""}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm text-white
                      `}
                    >
                      <GoPencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Update Nickname
                    </button>
                  )}
                </MenuItem>
              </div>
              {(isCurrentUserAdmin || isDeputy) && !member._admin && (
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => handleRemoveMemberAction(member)}
                        className={`
                          ${active ? "bg-red-700 text-white" : "text-red-400"}
                          group flex w-full items-center rounded-md px-2 py-2 text-sm
                        `}
                      >
                        <MdGroupRemove className="mr-2 h-4 w-4" aria-hidden="true" />
                        Remove Member
                      </button>
                    )}
                  </MenuItem>
                </div>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      )}
    </div>
  )

  if (!isOpen) return null

  useEffect(() => {
    if (isOpenGrantDeputyModalOpen !== false || isOpenRevokeDeputyModalOpen !== false) {
      fetchChatDetails()
    }
  }, [isOpenGrantDeputyModalOpen, isOpenRevokeDeputyModalOpen])

  return (
    <div className="bg-[#292929] text-white h-screen overflow-hidden w-80 p-4 flex flex-col shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-4 flex-shrink-0">
        {view === "members" && (
          <button onClick={() => setView("main")} className="p-1 rounded-full hover:bg-gray-700">
            <FaChevronLeft size={18} />
          </button>
        )}
        <h2 className="text-lg font-semibold text-center flex-grow">
          {view === "main" ? "Conversation Info" : "Members"}
        </h2>
        <button
          onClick={() => setIsChatInfoOpen(false)}
          className="p-2 rounded-full bg-[#484848] hover:bg-gray-700 transition-colors duration-150 -mr-0.5
          text-gray-300 hover:text-white"
          title="Close Conversation Information"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        {view === "main" ? (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <Image
                src={chatDetail?.avatar || (!isGroupChat ? otherMember?.avatar : null) || Images.AvatarDefault}
                alt={chatDetail?.name || (isGroupChat ? "Group" : otherMember?.name) || "Avatar"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mb-3 border-2 object-cover cursor-pointer"
                onClick={() =>
                  handleAvatarClickInInfo(chatDetail?.avatar || (!isGroupChat ? otherMember?.avatar : null))
                }
              />
              <p className="text-lg font-semibold truncate max-w-full px-4">
                {chatDetail?.name || (isGroupChat ? "Group Chat" : otherMember?.name) || "Conversation"}
              </p>
              {!isGroupChat && <p className="text-xs text-gray-400">{}</p>}
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-5 justify-items-center mb-6 text-xs text-center">
              <div className="flex flex-col items-center">
                <button
                  className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-600"
                  onClick={handlePinToggle}
                >
                  {isPinned ? <RiUnpinFill size={20} /> : <BsPinAngleFill size={20} />}
                </button>
                <span className="mt-1.5 whitespace-nowrap">{isPinned ? "Unpin" : "Pin"}</span>
              </div>
              {isGroupChat && (
                <div className="flex flex-col items-center">
                  <button
                    className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-600"
                    onClick={() => setIsOpenAddMembers(true)}
                  >
                    <AiOutlineUsergroupAdd size={22} />
                  </button>
                  <span className="mt-1.5 whitespace-nowrap">Add Member</span>
                </div>
              )}
              {isGroupChat && isCurrentUserAdmin && (
                <div className="flex flex-col items-center">
                  <button
                    className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-600"
                    onClick={() => setIsOpenUpdateGroupInfo(true)}
                    title="Update group name/avatar"
                  >
                    <IoSettingsOutline size={20} />
                  </button>
                  <span className="mt-1.5 whitespace-nowrap">Group Settings</span>
                </div>
              )}
            </div>
            <hr className="border-gray-700 my-4" />

            {isGroupChat && chatDetail?.members && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 px-2">Members ({chatDetail.members.length})</h3>
                <button
                  onClick={() => setView("members")}
                  className="flex items-center justify-between w-full py-2 px-2 mt-1 rounded-lg hover:bg-gray-700
                  text-sm text-white transition-colors duration-150"
                >
                  <span>View all members</span>
                  <FaChevronLeft size={12} className="transform rotate-180" />
                </button>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 px-2">Images & Videos</h3>
              <div className="flex flex-wrap justify-start gap-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                {imagesAndVideos.length === 0 ? (
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <FaRegFile size={18} /> No images and videos shared yet.
                  </div>
                ) : (
                  imagesAndVideos.map((item, idx) =>
                    item.type === "IMAGE" ? (
                      <Image
                        key={idx}
                        src={item.url}
                        alt="image"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setSelectedImageUrlForInfo(item.url)
                          setIsImageViewerOpen(true)
                        }}
                      />
                    ) : (
                      <video key={idx} src={item.url} controls className="w-16 h-16 rounded bg-black" />
                    ),
                  )
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 px-2">Files</h3>
              <div className="flex flex-col gap-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                {files.length === 0 ? (
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <FaRegFile size={18} /> No files shared yet.
                  </div>
                ) : (
                  files.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blue-400 hover:underline"
                    >
                      <FaRegFile size={16} />
                      {file.url.split("/").pop()}
                    </a>
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 px-2">Links</h3>
              <div className="flex flex-col gap-2 px-2 max-h-40 overflow-y-auto custom-scrollbar">
                {links.length === 0 ? (
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <FaRegFile size={18} /> No links shared yet.
                  </div>
                ) : (
                  links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-xs hover:underline"
                    >
                      {link.url}
                    </a>
                  ))
                )}
              </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <div className="px-2 space-y-2">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Options</h3>
              {isGroupChat ? (
                <>
                  <button
                    className="flex items-center gap-3 w-full py-2 px-2 rounded-lg hover:bg-red-800 bg-opacity-80 text-red-400 hover:text-red-300"
                    onClick={handleLeaveGroupAction}
                  >
                    <HiOutlineArrowRightEndOnRectangle size={20} />
                    <span className="text-sm">Leave Group</span>
                  </button>
                  {isCurrentUserAdmin && (
                    <button
                      className="flex items-center gap-3 w-full py-2 px-2 rounded-lg hover:bg-red-800 bg-opacity-80 text-red-400 hover:text-red-300"
                      onClick={handleDissolveGroupAction}
                    >
                      <FaTrashAlt size={18} />
                      <span className="text-sm">Dissolve Group</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  className={`flex items-center gap-3 w-full py-2 px-2 rounded-lg hover:bg-gray-700 ${
                    isBlocked ? "text-green-400 hover:text-green-300" : "text-yellow-400 hover:text-yellow-300"
                  }`}
                  onClick={handleBlockToggle}
                  disabled={blockUnblockLoading}
                >
                  {isBlocked ? <MdLockOpen size={20} /> : <MdBlock size={20} />}
                  <span className="text-sm">
                    {blockUnblockLoading
                      ? isBlocked
                        ? "Unblocking..."
                        : "Blocking..."
                      : isBlocked
                        ? "Unblock User"
                        : "Block User"}
                  </span>
                </button>
              )}

              <button
                className="flex items-center gap-3 w-full py-2 px-2 rounded-lg hover:bg-red-800 bg-opacity-80 text-red-400 hover:text-red-300"
                onClick={handleDeleteConversationAction}
              >
                <CgTrashEmpty size={20} />
                <span className="text-sm">Delete Conversation</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {isGroupChat && (
              <Button
                className="w-full mb-4 bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => setIsOpenAddMembers(true)}
              >
                <LuUserRoundPlus size={18} className="mr-2" />
                Add Member
              </Button>
            )}

            <div className="space-y-1">
              {sortedMembers.length ? (
                sortedMembers.map(renderMemberItem)
              ) : (
                <p className="text-center text-gray-400 text-sm py-4">No members found.</p>
              )}
            </div>
          </>
        )}
      </div>

      {isOpenAddMembers && (
        <ModalAddMembers
          isOpen={isOpenAddMembers}
          setIsOpen={setIsOpenAddMembers}
          conversationId={selectedChat}
          members={chatDetail?.members || []} // ✅ thêm dòng này
          onMembersAdded={() => {
            fetchChatDetails()
            onChatInfoUpdated()
          }}
        />
      )}

      {isOpenUpdateGroupInfo && (
        <ModalUpdateGroupInfo
          isOpen={isOpenUpdateGroupInfo}
          setIsOpen={setIsOpenUpdateGroupInfo}
          conversationId={selectedChat}
          currentGroupName={chatDetail?.name || ""}
          currentGroupAvatar={chatDetail?.avatar || ""}
          onGroupInfoUpdated={() => {
            fetchChatDetails()
            onChatInfoUpdated()
          }}
          handleReload={handleReloadTrigger}
        />
      )}

      {isOpenDeleteConversation && (
        <ModalDeleteConversation
          isOpen={isOpenDeleteConversation}
          setIsOpen={setIsOpenDeleteConversation}
          chatId={selectedChat}
          onHistoryDeleted={onHistoryDeleted}
          handleReloadConverstation={handleReloadTrigger}
        />
      )}

      {isNicknameModalOpen && memberToAction && (
        <ModalUpdateNickname
          isOpen={isNicknameModalOpen}
          setIsOpen={setIsNicknameModalOpen}
          conversationId={selectedChat}
          participantId={memberToAction.id!}
          currentNickname={memberToAction.name!}
          onNicknameUpdated={handleNicknameUpdated}
        />
      )}

      <ModalConfirm
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title={confirmModalProps.title}
        message={confirmModalProps.message}
        onConfirm={confirmModalProps.onConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
      />

      <ModalSuccess isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen} message={successMessage} />

      {isProfileViewModalOpen && selectedFriendForView && (
        <ProfileViewModal
          isOpen={isProfileViewModalOpen}
          setIsOpen={setIsProfileViewModalOpen}
          friend={selectedFriendForView}
        />
      )}

      {isImageViewerOpen && selectedImageUrlForInfo && (
        <ModalImageViewer
          isOpen={isImageViewerOpen}
          setIsOpen={setIsImageViewerOpen}
          imageUrl={selectedImageUrlForInfo}
          imageAlt="Profile Avatar"
        />
      )}

      {isOpenGrantDeputyModalOpen && (
        <ModalConfirmDeputy
          isOpen={isOpenGrantDeputyModalOpen}
          setIsOpen={setIsOpenGrantDeputyModalOpen}
          chatId={selectedChat}
          isAdmin={isCurrentUserAdmin}
          token={token}
          userId={userId}
          selectDeputyId={selectDeputyId}
          type="grant"
          handleReloadMemeber={handleReloadViewMemeber}
        />
      )}

      {isOpenRevokeDeputyModalOpen && (
        <ModalConfirmDeputy
          isOpen={isOpenRevokeDeputyModalOpen}
          setIsOpen={setIsOpenRevokeDeputyModalOpen}
          chatId={selectedChat}
          isAdmin={isCurrentUserAdmin}
          token={token}
          userId={userId}
          selectDeputyId={selectDeputyId}
          type="revoke"
          handleReloadMemeber={handleReloadViewMemeber}
        />
      )}

      {isOpenLeaveGroupOwner && (
        <ModalLeaveGroupOwner
          isOpen={isOpenLeaveGroupOwner}
          setIsOpen={setIsOpenLeaveGroupOwner}
          conversationId={selectedChat}
          userId={userId}
          token={token}
          handleReload={handleReloadTrigger}
        />
      )}
    </div>
  )
}

export default ChatInfo
