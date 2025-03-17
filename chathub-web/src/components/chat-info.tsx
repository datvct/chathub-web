"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Images } from "~/constants/images"
import { useConversation } from "~/hooks/use-converstation";
import { useSelector } from "react-redux";
import { RootState } from "~/lib/reudx/store";
import { ChatDetailSectionResponse, MemberDTO, UserDTO } from "~/codegen/data-contracts";
import { toast } from "react-toastify";
import { GoBell, GoBellSlash } from "react-icons/go"
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
import { FaTimesCircle } from "react-icons/fa";
import { Button } from "./ui/button"
import { LuUserRoundPlus } from "react-icons/lu"
import ModalAddMembers from "./modal-add-members"
import ModalDissolveGroup from "./modal-dissolve-group"
import ModalUpdateGroupInfo from "./modal-update-group-info"
import ModalConfirm from "./modal-confirm"
import ModalSuccess from "./modal-success"

interface ChatInfoProps {
  isOpen?: boolean;
  isGroupChat?: boolean;
  selectedChat: number;
  setIsChatInfoOpen: (isOpen: boolean) => void;
  onPinChange: () => void;
}

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
  setIsChatInfoOpen,
  onPinChange,
}: ChatInfoProps) => {
  const router = useRouter();

  const [isOpenLeaveGroup, setIsOpenLeaveGroup] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isOpenAddMembers, setIsOpenAddMembers] = useState(false)
  const [isOpenDissolveGroup, setIsOpenDissolveGroup] = useState(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isOpenUpdateGroupInfo, setIsOpenUpdateGroupInfo] = useState(false)
  const [isOpenConfirmRemove, setIsOpenConfirmRemove] = useState(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] = useState(false);
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<MemberDTO | null>(null);
  const [isOpenListingGroupMembers, setIsOpenListingGroupMembers] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const {
    getChatDetailSection,
    removeParticipantFromGroup,
    pinConversation,
    deleteConversation,
  } = useConversation();
  const [chatDetail, setChatDetail] = useState<ChatDetailSectionResponse | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState<boolean>(false);
  const isCurrentUserAdmin = chatDetail?.members?.find(m => m.id === userId)?.is_admin || false;


  useEffect(() => {
    const fetchChatDetails = async () => {
      if (selectedChat && userId && token) {
        const details = await getChatDetailSection(selectedChat, userId, token);
        setChatDetail(details || null);
        console.log("Chat Detail Section Data:", details);
      }
    };
    fetchChatDetails();
  }, [selectedChat, userId, token, getChatDetailSection]);

  const handleMuteConversation = () => {
    setIsMuted(!isMuted);
    toast.success(`${isMuted ? 'Unmuted' : 'Muted'} conversation successfully!`);
  };

  const handlePinConversation = async () => {
    if (!selectedChat || !userId || !token) return;
    try {
      const newPinState = !isPinned;
      const pinSuccess = await pinConversation(selectedChat, userId, newPinState, token);
      if (pinSuccess) {
        setIsPinned(newPinState);
        if (onPinChange) {
          onPinChange();
        }
        toast.success(`Conversation ${newPinState ? 'pinned' : 'unpinned'} successfully!`);
      } else {
        toast.error("Failed to pin conversation.");
      }
    } catch (error) {
      console.error("Error pinning conversation:", error);
      toast.error("Failed to pin conversation.");
    }
  };

  const handleDeleteChatHistory = async () => {
    if (!selectedChat || !userId || !token) return;
    setIsDeletingConversation(true);
    try {
      const deleteSuccess = await deleteConversation(selectedChat, userId, token);
      if (deleteSuccess) {
        setIsChatInfoOpen(false);
        router.push('/');
        toast.success("Chat history deleted successfully!");
      } else {
        toast.error("Failed to delete chat history.");
      }
    } catch (error) {
      console.error("Error deleting chat history:", error);
      toast.error("Failed to delete chat history.");
    } finally {
      setIsDeletingConversation(false);
    }
  };

  const handleRemoveMember = async (participantId: number) => {
    if (!selectedChat || !userId || !token) return;

    try {
      const removeSuccess = await removeParticipantFromGroup(selectedChat, userId, participantId, token);

      if (removeSuccess) {
        setRemoveSuccessMessage("Member removed from group successfully!");
        setIsOpenSuccessRemove(true);
        setIsOpenConfirmRemove(false);
        if (selectedChat && userId && token) {
          getChatDetailSection(selectedChat, userId, token);
        }
        setMemberToRemove(null);
      } else {
        toast.error("Failed to remove member from group.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member from group.");
    }
  };

  const handleConfirmRemoveMember = (member: MemberDTO) => {
    setMemberToRemove(member);
    setIsOpenConfirmRemove(true);
  };

  const handleCancelRemoveMember = () => {
    setIsOpenConfirmRemove(false);
    setMemberToRemove(null);
  };

  const handleOpenUpdateGroupInfoModal = () => {
    setIsOpenUpdateGroupInfo(true);
  };

  const handleGroupInfoUpdatedSuccess = () => {
    onPinChange();
  };

  if (!isOpen) return null;

  const handleAddMembers = (members: Member[]) => {
    setIsAddingMember(false)
  };

  const handleMembersAddedSuccess = () => {
    if (selectedChat && userId && token) {
      getChatDetailSection(selectedChat, userId, token);
    }
  };

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
                  src={chatDetail?.avatar || Images.ImageDefault}
                  className="w-20 h-20 rounded-full"
                  alt="Avatar"
                  width={80}
                  height={80}
                />
                <p className="mt-2 text-lg font-semibold">
                  {chatDetail?.name || "Conversation Name"}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center flex-col">
                  <button
                    className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
                    onClick={handleMuteConversation}
                  >
                    {isMuted ? (
                      <GoBellSlash size={20} color="white" className="text-white" />
                    ) : (
                      <GoBell size={20} color="white" className="text-white" />
                    )}
                  </button>
                  <span>
                    {isMuted ? 'Unmute' : 'Mute'}
                  </span>
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
                  <button
                    className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
                    onClick={handlePinConversation}
                  >
                    <BsPinAngleFill size={20} color="white" className="text-white" />
                  </button>
                  <span className="whitespace-nowrap">Pin</span>
                </div>
                {isGroupChat && (
                  <div className="flex items-center flex-col">
                    <button
                      className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
                      onClick={handleOpenUpdateGroupInfoModal}
                    >
                      <IoSettingsOutline size={20} color="white" className="text-white" />
                    </button>
                    <span className="whitespace-nowrap">
                      Manage group
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isGroupChat && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Group Members</h3>
                <button className="mt-3 px-3 w-full flex gap-2" onClick={() => setIsAddingMember(true)}>
                  <LuUserRound size={20} color="white" />
                  <span>
                    {chatDetail?.members?.length} Memebers
                  </span>
                </button>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-md font-semibold">Photos/ Videos</h3>
              <div className="grid grid-cols-4 gap-x-2 gap-y-4 mt-3 px-2">
                {chatDetail?.list_media?.map((media, index) => (
                  <Image
                    key={index}
                    src={media.url || Images.ImageDefault}
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
                  <>
                    <button
                      className="flex items-center gap-3"
                      onClick={() => setIsOpenLeaveGroup(true)}
                    >
                      <HiOutlineArrowRightEndOnRectangle size={25} color="red" className="font-semibold" />
                      <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">Leave group</span>
                    </button>
                    <button
                      className="flex items-center gap-3"
                      onClick={() => setIsOpenDissolveGroup(true)}
                    >
                      <HiOutlineArrowRightEndOnRectangle size={25} color="red" className="font-semibold" />
                      <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">
                        Dissolve Group
                      </span>
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-3">
                    <MdBlock size={25} color="white" className="text-white font-semibold" />
                    <span className="text-sm font-semibold leading-[25px]">Block</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-3"
                  onClick={handleDeleteChatHistory}
                >
                  <CgTrashEmpty size={25} color="red" className="text-red font-semibold" />
                  <span className="text-sm font-semibold leading-[25px] text-[#FF0000]">
                    Delete chat history
                  </span>
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
            <div className="mt-4">
              List members ({chatDetail?.members?.length || 0})
            </div>
            {/* <div className="mt-3 px-2">
              {chatDetail?.members?.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Image
                    src={member.avatar || Images.AvatarDefault}
                    alt={"avatar"}
                    className="w-[3.125rem] h-[3.125rem] rounded-[30px]"
                    width={50}
                    height={50}
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div> */}

            <div className="mt-3 px-2">
              {chatDetail?.members?.map((member, i) => {
                const isAdmin = member.is_admin;
                const isCurrentUserAdmin = chatDetail?.members?.find(m => m.id === userId)?.is_admin || false;
                const isCurrentUser = member.id === userId;

                console.log(`Member: ${member.name}, isAdmin: ${isAdmin}, isCurrentUserAdmin: ${isCurrentUserAdmin}, isCurrentUser: ${isCurrentUser}`);

                return (
                  <div key={i} className="flex items-center gap-3 p-2 justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={member.avatar || Images.AvatarDefault}
                        alt={"avatar"}
                        className="w-[3.125rem] h-[3.125rem] rounded-[30px]"
                        width={50}
                        height={50}
                      />
                      <div>
                        <span>{member.name}</span>
                        {isAdmin && <span className="text-xs text-gray-400 ml-1">(Admin)</span>}
                      </div>
                    </div>
                    {isGroupChat && isCurrentUserAdmin && !isCurrentUser && !isAdmin && (
                      <button
                        onClick={() => handleConfirmRemoveMember(member)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimesCircle size={20} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {isOpenAddMembers && (
        <ModalAddMembers
          isOpen={isOpenAddMembers}
          setIsOpen={setIsOpenAddMembers}
          conversationId={selectedChat!}
          onMembersAdded={handleMembersAddedSuccess}
        />
      )}
      {isOpenLeaveGroup && (
        <ModalLeaveGroup
          isOpen={isOpenLeaveGroup}
          setIsOpen={setIsOpenLeaveGroup}
          chatId={selectedChat} />
      )}
      {isOpenDissolveGroup && (
        <ModalDissolveGroup
          isOpen={isOpenDissolveGroup}
          setIsOpen={setIsOpenDissolveGroup}
          chatId={selectedChat} />
      )}
      {isOpenUpdateGroupInfo && (
        <ModalUpdateGroupInfo
          isOpen={isOpenUpdateGroupInfo}
          setIsOpen={setIsOpenUpdateGroupInfo}
          conversationId={selectedChat!}
          currentGroupName={chatDetail?.name || ""}
          currentGroupAvatar={chatDetail?.avatar || ""}
          onGroupInfoUpdated={handleGroupInfoUpdatedSuccess}
        />
      )}
      <ModalConfirm
        isOpen={isOpenConfirmRemove}
        setIsOpen={setIsOpenConfirmRemove}
        onConfirm={() => {
          if (memberToRemove) {
            handleRemoveMember(memberToRemove.id || 0);
          }
        }}
        onCancel={handleCancelRemoveMember}
        title="Confirm Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.name} from the group?`}
      />
      <ModalSuccess
        isOpen={isOpenSuccessRemove}
        setIsOpen={setIsOpenSuccessRemove}
        message={removeSuccessMessage}
      />
    </div>
  )
}

export default ChatInfo
