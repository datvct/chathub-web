"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Images } from "~/constants/images"
import { useConversation } from "~/hooks/use-converstation";
import { useSelector } from "react-redux";
import { RootState } from "~/lib/reudx/store";
import { ChatDetailSectionResponse, ConversationResponse } from "~/codegen/data-contracts";
import { toast } from "react-toastify";
import { GoBell, GoBellSlash } from "react-icons/go"
import { BsPinAngleFill } from "react-icons/bs"
import { RiUnpinFill } from "react-icons/ri"
import { FaRegFile } from "react-icons/fa"
import { FaLink } from "react-icons/fa6"
import { MdBlock } from "react-icons/md"
import { CgTrashEmpty } from "react-icons/cg"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoSettingsOutline } from "react-icons/io5"
import { LuUserRound } from "react-icons/lu"
import { FaUserFriends } from "react-icons/fa"
import { HiOutlineArrowRightEndOnRectangle } from "react-icons/hi2"
import ModalLeaveGroup from "./modal-leave-group"
import { FaChevronLeft } from "react-icons/fa6"
import { Button } from "./ui/button"
import { LuUserRoundPlus } from "react-icons/lu"
import ModalAddMembers from "./modal-add-members"
import ModalDissolveGroup from "./modal-dissolve-group"
import ModalUpdateGroupInfo from "./modal-update-group-info"
import ModalConfirm from "./modal-confirm"
import ModalSuccess from "./modal-success"
import { getRecentConversationByUserID } from "~/lib/get-conversation"
import ModalDeleteConversation from "~/components/modal-delete-conversation"

interface ChatInfoProps {
  isOpen?: boolean;
  isGroupChat?: boolean;
  selectedChat: number;
  setIsChatInfoOpen: (isOpen: boolean) => void;
  onPinChange: (isPinned: boolean) => void;
  onHistoryDeleted: () => void;
}

interface Member {
  name: string;
  phone: string;
  image: any;
  selected?: boolean;
}

const ChatInfo = ({
  isOpen,
  isGroupChat,
  selectedChat,
  setIsChatInfoOpen,
  onPinChange,
  onHistoryDeleted,
}: ChatInfoProps) => {
  const router = useRouter();

  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const {
    getGroupConversations,
    getChatDetailSection,
    removeParticipantFromGroup,
    pinConversation,
    deleteConversation,
    leaveGroupConversation
  } = useConversation(userId, token);

  const [isOpenLeaveGroup, setIsOpenLeaveGroup] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isOpenAddMembers, setIsOpenAddMembers] = useState(false);
  const [isOpenDissolveGroup, setIsOpenDissolveGroup] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOpenUpdateGroupInfo, setIsOpenUpdateGroupInfo] = useState(false);
  const [isOpenConfirmRemove, setIsOpenConfirmRemove] = useState(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] = useState(false);
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isOpenDeleteConversation, setIsOpenDeleteConversation] = useState(false);

  const [chatDetail, setChatDetail] = useState<ChatDetailSectionResponse | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState<boolean>(false);
  const isCurrentUserAdmin = chatDetail?.members?.find((m) => m.id === userId)?.is_admin || false;

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (selectedChat && userId && token) {
        const details = await getChatDetailSection(selectedChat, userId, token);
        setChatDetail(details || null);
      }
    };
    fetchChatDetails();
  }, [selectedChat, userId, token]);

  const handleLeaveGroup = async () => {
    if (!selectedChat || !userId || !token) return;
    try {
      const response = await leaveGroupConversation(selectedChat, userId, token);
      if (response?.statusCode === 200) {
        toast.success("Left group successfully!");
        setIsChatInfoOpen(false);
        setTimeout(() => {
          router.push("/");
        }, 6000);
      }
    } catch (error: any) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group.");
    }
  };

  useEffect(() => {
    const fetchRecentConversations = async () => {
      if (userId && token) {
        const recentConversations = await getRecentConversationByUserID(userId, token);
        const pinnedConversations = recentConversations.filter(conversation => conversation.pinned);
        console.log("Pinned Conversations:", pinnedConversations);
        setIsPinned(pinnedConversations.some(conversation => conversation.id === selectedChat));
      }
    };
    fetchRecentConversations();
  }, [userId, token, selectedChat]);


  const handleMuteConversation = () => {
    setIsMuted(!isMuted);
    toast.success(`${isMuted ? "Unmuted" : "Muted"} conversation successfully!`);
  };

  const handlePinConversation = async () => {
    if (!selectedChat || !userId || !token) return;
    try {
      const newPinState = !isPinned;
      const pinSuccess = await pinConversation(selectedChat, userId, newPinState, token);
      if (pinSuccess) {
        setIsPinned(newPinState);
        if (onPinChange) {
          onPinChange(newPinState);
        }
        toast.success(`Conversation ${newPinState ? "pinned" : "unpinned"} successfully!`);
      } else {
        toast.error("Failed to pin conversation.");
      }
    } catch (error) {
      console.error("Error pinning conversation:", error);
      toast.error("Failed to pin conversation.");
    }
  };

  const handleDeleteConversation = async () => {
    setIsOpenDeleteConversation(true);
  };

  const handleRemoveMember = async (participantId: number) => {
    if (!selectedChat || !userId || !token) return;
    try {
      const response = await removeParticipantFromGroup(selectedChat, userId, participantId, token);
      if (response?.statusCode === 200) {
        setSuccessMessage("Member removed successfully!");
        setIsSuccessModalOpen(true);
        getChatDetailSection(selectedChat, userId, token);
      } else {
        toast.error("Failed to remove member.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member.");
    }
  };

  const handleRemoveMemberConfirm = () => {
    if (memberToRemove !== null) {
      handleRemoveMember(memberToRemove);
    }
    setIsConfirmModalOpen(false);
    setMemberToRemove(null);
  };

  const handleRemoveMemberCancel = () => {
    setIsConfirmModalOpen(false);
    setMemberToRemove(null);
  };

  const handleRemoveMemberAction = (participantId: number) => {
    setMemberToRemove(participantId);
    setIsConfirmModalOpen(true);
  };


  const handleOpenUpdateGroupInfoModal = () => {
    setIsOpenUpdateGroupInfo(true);
  };

  const handleGroupInfoUpdatedSuccess = () => {
    onPinChange(isPinned);
  };

  if (!isOpen) return null;

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
                  <span>{isMuted ? "Unmute" : "Mute"}</span>
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
                    onClick={async () => {
                      await handlePinConversation();
                      onPinChange(isPinned);
                    }}
                  >
                    {isPinned ? (
                      <RiUnpinFill size={20} color="white" className="text-white" />
                    ) : (
                      <BsPinAngleFill size={20} color="white" className="text-white" />
                    )}
                  </button>
                  <span className="whitespace-nowrap">
                    {isPinned ? "Unpin" : "Pin"}
                  </span>
                </div>
                {isGroupChat && (
                  <div className="flex items-center flex-col">
                    <button
                      className="bg-[#484848] h-10 w-10 rounded-full flex items-center justify-center"
                      onClick={handleOpenUpdateGroupInfoModal}
                    >
                      <IoSettingsOutline size={20} color="white" className="text-white" />
                    </button>
                    <span className="whitespace-nowrap">Manage group</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Group members</h3>
              <div className="flex items-center justify-between mt-2 cursor-pointer" onClick={() => setIsAddingMember(true)}>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#484848] w-full">
                  <FaUserFriends size={20} color="white" className="text-white" />
                  <span>{chatDetail?.members?.length} members</span>
                </div>
              </div>
            </div>

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
                  <div
                    key={i}
                    className="flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FaRegFile
                        size={40}
                        color="white"
                        className="text-white"
                      />
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
                  <div
                    key={i}
                    className="flex items-center gap-3 justify-between"
                  >
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
                      onClick={() => { setIsOpenLeaveGroup(true); handleLeaveGroup(); }}
                    >
                      <HiOutlineArrowRightEndOnRectangle
                        size={25}
                        color="red"
                        className="font-semibold"
                      />
                      <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">
                        Leave group
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-3"
                      onClick={() => setIsOpenDissolveGroup(true)}
                    >
                      <HiOutlineArrowRightEndOnRectangle
                        size={25}
                        color="red"
                        className="font-semibold"
                      />
                      <span className="text-sm text-[#FF0000] font-semibold leading-[25px]">
                        Dissolve Group
                      </span>
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-3">
                    <MdBlock
                      size={25}
                      color="white"
                      className="text-white font-semibold"
                    />
                    <span className="text-sm font-semibold leading-[25px]">
                      Block
                    </span>
                  </button>
                )}

                <button
                  className="flex items-center gap-3"
                  onClick={handleDeleteConversation}
                >
                  <CgTrashEmpty
                    size={25}
                    color="red"
                    className="text-red font-semibold"
                  />
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
              <span>Member</span>
            </div>
          </div>
          <div className="mt-4">
            {isGroupChat && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">
                  Listing Members ({chatDetail?.members?.length} Members)
                </h3>
                <Button className="w-full bg-[#D9D9D9] hover:bg-white mt-3"
                  onClick={() => setIsOpenAddMembers(true)}>
                  <LuUserRoundPlus size={20} color="black" />
                  <span className="text-black text-sm">Add member</span>
                </Button>
                <div className="mt-3 px-2">
                  {chatDetail?.members?.map((member, i) => {
                    const isAdmin = chatDetail?.members?.find((m) => m.id === userId)?.is_admin;

                    if (member.id === userId) {
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
                            <span>
                              {member.name} (You) {member.is_admin ? "(Admin)" : ""}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={member.avatar || Images.AvatarDefault}
                            alt={"avatar"}
                            className="w-[3.125rem] h-[3.125rem] rounded-[30px]"
                            width={50}
                            height={50}
                          />
                          <span>
                            {member.name} {member.is_admin ? "(Admin)" : ""}
                          </span>
                        </div>
                        {isAdmin && !member.is_admin && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMemberAction(Number(member.id))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )
      }

      {
        isOpenAddMembers && (
          <ModalAddMembers
            isOpen={isOpenAddMembers}
            setIsOpen={setIsOpenAddMembers}
            conversationId={selectedChat!}
            onMembersAdded={handleMembersAddedSuccess}
          />
        )
      }
      {
        isOpenLeaveGroup && (
          <ModalLeaveGroup
            isOpen={isOpenLeaveGroup}
            setIsOpen={setIsOpenLeaveGroup}
            chatId={selectedChat}
            setSelectedChatId={setSelectedChatId}
          />
        )
      }
      {
        isOpenDissolveGroup && (
          <ModalDissolveGroup
            isOpen={isOpenDissolveGroup}
            setIsOpen={setIsOpenDissolveGroup}
            chatId={selectedChat}
          />
        )
      }
      {
        isOpenUpdateGroupInfo && (
          <ModalUpdateGroupInfo
            isOpen={isOpenUpdateGroupInfo}
            setIsOpen={setIsOpenUpdateGroupInfo}
            conversationId={selectedChat!}
            currentGroupName={chatDetail?.name || ""}
            currentGroupAvatar={chatDetail?.avatar || ""}
            onGroupInfoUpdated={handleGroupInfoUpdatedSuccess}
          />
        )
      }
      <ModalConfirm
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onConfirm={handleRemoveMemberConfirm}
        onCancel={handleRemoveMemberCancel}
        title="Remove Member"
        message={`Are you sure you want to remove this member from the group?`}
      />
      <ModalSuccess
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        message={successMessage}
      />
      {isOpenDeleteConversation && (
        <ModalDeleteConversation
          isOpen={isOpenDeleteConversation}
          setIsOpen={setIsOpenDeleteConversation}
          chatId={selectedChat}
          onHistoryDeleted={onHistoryDeleted}
        />
      )}
    </div >
  );
};

export default ChatInfo;
