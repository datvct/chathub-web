import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import { Images } from "../constants/images"
import { Button } from "./ui/button"
import { FriendRequestResponse, FriendshipRequest } from "~/codegen/data-contracts"
import { useFriends } from "../hooks/use-friends"
import { useSelector } from "react-redux"
import { RootState } from "../lib/reudx/store"
import ModalConfirm from "./modal-confirm"
import ModalSuccess from "./modal-success"

const ModalFriendRequests: React.FC<{ isOpen: boolean; setIsOpen: (open: boolean) => void }> = ({
  isOpen,
  setIsOpen,
}) => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const token = useSelector((state: RootState) => state.auth.token)
  const [activeTab, setActiveTab] = useState("received")
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestResponse[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequestResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getListFriendRequests, acceptFriendRequestHook, rejectFriendRequestHook, unsentFriendRequestHook } =
    useFriends(userId, token)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch danh sách lời mời kết bạn từ API
  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getListFriendRequests()
        console.log(response)

        // Phân loại lời mời theo type
        const received = response.filter(req => req.type === "RECEIVED")
        const sent = response.filter(req => req.type === "SENT")

        setReceivedRequests(received)
        setSentRequests(sent)
      } catch (err) {
        console.error("Error fetching friend requests:", err)
        setError("Failed to load friend requests.")
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) fetchFriendRequests()
  }, [isOpen]) // Gọi API khi modal mở

  // Chọn danh sách hiển thị dựa trên tab đang chọn
  const requestsToDisplay = activeTab === "received" ? receivedRequests : sentRequests

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction()
    setIsConfirmOpen(false)
  }

  const handleAccept = async (senderId: number) => {
    const requestData: FriendshipRequest = { senderId, receiverId: userId }
    const response = await acceptFriendRequestHook(requestData)
    if (response) {
      setReceivedRequests(receivedRequests.filter(req => req.userId !== senderId))
      setSuccessMessage("Friend request accepted successfully!")
      setIsSuccessOpen(true)
    }
  }

  const handleReject = async (senderId: number) => {
    setConfirmAction(() => async () => {
      const requestData: FriendshipRequest = { senderId, receiverId: userId }
      const response = await rejectFriendRequestHook(requestData)
      if (response) {
        setReceivedRequests(receivedRequests.filter(req => req.userId !== senderId))
      }
    })
    setIsConfirmOpen(true)
  }

  const handleUnsent = async (friendId: number) => {
    setConfirmAction(() => async () => {
      const response = await unsentFriendRequestHook(friendId)
      if (response) {
        setSentRequests(sentRequests.filter(req => req.userId !== friendId))
      }
    })
    setIsConfirmOpen(true)
  }

  return (
    <>
      {/* Modal xác nhận */}
      <ModalConfirm
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
      />

      {/* Modal thành công */}
      <ModalSuccess isOpen={isSuccessOpen} setIsOpen={setIsSuccessOpen} message={successMessage} />
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
                <DialogPanel className="bg-[#385068] rounded-[5%] w-[80%] h-[95%] max-w-2xl max-h-screen transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
                    <div className="flex items-center gap-x-2">
                      <Image src={Images.IconChatList} alt="Chat Icon" width={40} height={40} />
                      <span className="text-[25px] font-bold">Friend Request</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                      <Image src={Images.IconCloseModal} alt="close modal" width={40} height={40} />
                    </button>
                  </DialogTitle>

                  <hr className="w-full border-gray-500 p-2 mb-3" />

                  <div className="relative mb-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab("received")}
                        className={`px-4 py-2 rounded-lg text-white font-semibold
                        ${activeTab === "received" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}`}
                      >
                        Received ({receivedRequests.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("sent")}
                        className={`px-4 py-2 rounded-lg text-white font-semibold
                        ${activeTab === "sent" ? "bg-[#501794]" : "bg-[#8C8595] hover:bg-[#7746F5]"}`}
                      >
                        Sent ({sentRequests.length})
                      </button>
                    </div>
                  </div>

                  {/* Loading & Error Handling */}
                  {loading && <div className="loader"></div>}
                  {error && <p className="text-red-500 text-center">{error}</p>}

                  {/* Danh sách lời mời */}
                  <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
                    {requestsToDisplay.map((request, index) => (
                      <div
                        key={index}
                        className="flex items-center odd:bg-[#E4DEED] even:bg-[#AF9CC9] rounded-lg p-3 mb-3 space-x-3"
                      >
                        <Image
                          src={request.avatar}
                          alt={request.name}
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-black font-medium">{request.name}</p>
                          <p className="text-gray-600 text-sm italic">{request.message}</p>
                        </div>
                        <div className="space-x-2">
                          {activeTab === "received" && (
                            <>
                              <Button
                                onClick={() => handleReject(request.userId!)}
                                className="px-4 py-2 border border-white rounded-[12px] text-sm text-white bg-gray-500 hover:bg-gray-700"
                              >
                                Decline
                              </Button>
                              <Button
                                onClick={() => handleAccept(request.userId!)}
                                className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white"
                              >
                                Accept
                              </Button>
                            </>
                          )}
                          {activeTab === "sent" && (
                            <Button
                              onClick={() => handleUnsent(request.userId!)}
                              className="w-20 px-4 py-2 bg-[#7746f5] rounded-[12px] text-lg text-white"
                            >
                              Unsent
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ModalFriendRequests
