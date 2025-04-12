"use client"

import React, { useState, useEffect, useCallback, Fragment } from "react"
import { useSelector } from "react-redux"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Search, X, UserPlus, CheckCircle, Clock } from "lucide-react"
import { toast } from "react-toastify"
import { RootState } from "~/lib/reudx/store"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Images } from "../constants/images"
import { getListFriends } from "~/lib/get-friend"
import { useFindUserByPhoneNumber } from "~/hooks/use-find-user-by-phone-number"
import { useFriends } from "~/hooks/use-friends"
import { UserDTO, FriendshipRequest, FriendRequestResponse } from "~/codegen/data-contracts"
import "../styles/custom-scroll.css"
import { FriendshipStatus } from "~/types/types"

const formatPhoneNumberForAPI = (phone: string): string => {
	let cleaned = phone.replace(/\s+/g, "")
	if (cleaned.startsWith("+84")) {
		cleaned = "0" + cleaned.substring(3)
	} else if (!cleaned.startsWith("0")) {
		cleaned = "0" + cleaned
	}
	return cleaned
}

interface ModalFindFriendProps {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
}

const ModalFindFriend: React.FC<ModalFindFriendProps> = ({ isOpen, setIsOpen }) => {
	const currentUser = useSelector((state: RootState) => state.auth)
	const token = currentUser.token
	const currentUserId = currentUser.userId

	const [phoneNumber, setPhoneNumber] = useState("")
	const [searchTriggered, setSearchTriggered] = useState(false)

	const {
		user: foundUser,
		loading: findUserLoading,
		error: findUserError,
		checkPhoneNumber,
	} = useFindUserByPhoneNumber()

	const {
		friends: currentFriends,
		loading: friendsLoading,
		error: friendsError,
		getListFriendRequests,
		sendFriendRequestHook,
	} = useFriends(currentUserId!, token!)

	const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>("idle")
	const [apiError, setApiError] = useState<string | null>(null)

	const checkFriendship = useCallback(
		async (targetUser: UserDTO) => {
			setFriendshipStatus("loading")
			setApiError(null)

			if (!currentUserId || !token || !targetUser || !targetUser.id) {
				setFriendshipStatus("idle")
				return
			}

			if (targetUser.id === currentUserId) {
				setFriendshipStatus("is_self")
				return
			}

			try {
				const friendsList = await getListFriends(currentUserId, token)
				if (friendsList?.some(friend => friend.id === targetUser.id)) {
					setFriendshipStatus("already_friend")
					return
				}
				const requests = await getListFriendRequests()
				if (requests) {
					const sentRequest = requests.find(req => req.type === "SENT" && req.userId === targetUser.id)
					if (sentRequest) {
						setFriendshipStatus("request_sent")
						return
					}
					const receivedRequest = requests.find(req => req.type === "RECEIVED" && req.userId === targetUser.id)
					if (receivedRequest) {
						setFriendshipStatus("request_received")
						setFriendshipStatus("not_friend")
						return
					}
				}
				setFriendshipStatus("not_friend")
			} catch (error: any) {
				console.error("Error checking friendship:", error)
				setApiError("Could not determine relationship status.")
				setFriendshipStatus("idle")
			}
		},
		[currentUserId, token, getListFriendRequests],
	)

	useEffect(() => {
		if (foundUser) {
			checkFriendship(foundUser)
		} else {
			setFriendshipStatus(findUserError ? "not_found" : "idle")
			setApiError(findUserError)
		}
		if (!foundUser && !findUserError) {
			setApiError(null)
		}
	}, [foundUser, checkFriendship, findUserError])

	const handleClose = () => {
		setIsOpen(false)
		setPhoneNumber("")
		setSearchTriggered(false)
		setApiError(null)
	}

	const handleSearch = async () => {
		const phoneToSearch = formatPhoneNumberForAPI(phoneNumber)
		if (!phoneToSearch || phoneToSearch.length < 10) {
			setApiError("Please enter a valid phone number (at least 10 digits).")
			setFriendshipStatus("idle")
			setSearchTriggered(true)
			return
		}
		setApiError(null)
		setSearchTriggered(true)
		setFriendshipStatus("loading")
		const result = await checkPhoneNumber(phoneToSearch)
		if (!result.isSuccess) {
			setFriendshipStatus("not_found")
		}
	}

	const handleAddFriend = async () => {
		if (!foundUser || !foundUser.id || !currentUserId || !token) return
		if (friendshipStatus !== "not_friend") return
		setApiError(null)
		const requestData: FriendshipRequest = {
			senderId: currentUserId,
			receiverId: foundUser.id,
			message: `Hi, I'd like to add you on ChatHub!`,
		}
		try {
			const response = await sendFriendRequestHook(requestData)
			if (response?.statusCode === 200) {
				toast.success(`Friend request sent to ${foundUser.name}!`)
				setFriendshipStatus("request_sent")
			} else {
				toast.error("Failed to send friend request.")
				setApiError("Failed to send friend request.")
			}
		} catch (error) {
			toast.error("An unexpected error occurred.")
			setApiError("An unexpected error occurred.")
		}
	}

	const renderFriendStatusButton = () => {
		const isLoading = findUserLoading || friendshipStatus === "loading"
		switch (friendshipStatus) {
			case "is_self":
				return <p className="text-sm text-gray-500 italic">You cannot add yourself.</p>
			case "not_friend":
				return (
					<Button
						onClick={handleAddFriend}
						disabled={isLoading}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
					>
						{isLoading ? (
							"Processing..."
						) : (
							<>
								<UserPlus size={16} className="mr-1" /> Add
							</>
						)}
					</Button>
				)
			case "request_sent":
				return (
					<Button
						disabled
						variant="outline"
						className="border-gray-400 text-gray-600 px-4 py-1 rounded-md text-sm cursor-not-allowed"
					>
						<Clock size={16} className="mr-1" /> Sent
					</Button>
				)
			case "request_received":
				return (
					<Button
						variant="outline"
						disabled
						className="border-yellow-500 text-yellow-700 px-4 py-1 rounded-md text-sm"
					>
						Accept Request?
					</Button>
				)
			case "already_friend":
				return (
					<Button disabled variant="ghost" className="text-green-600 px-4 py-1 rounded-md text-sm cursor-not-allowed">
						<CheckCircle size={16} className="mr-1" /> Friends
					</Button>
				)
			case "loading":
				return <div className="loader-small"></div>
			case "not_found":
				return null
			case "idle":
			default:
				return null
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(e.target.value)
		if (searchTriggered) {
			setFriendshipStatus("idle")
			setSearchTriggered(false)
			setApiError(null)
		}
		setApiError(null)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			handleSearch()
		}
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={handleClose}>
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-50" />
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
							<DialogPanel className="bg-[#385068] rounded-[20px] w-full max-w-md transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
								<DialogTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white leading-6">
									<span className="text-[25px]">Find Friend</span>
									<button onClick={handleClose}>
										<Image src={Images.IconCloseModal} alt="close modal" width={35} height={35} />
									</button>
								</DialogTitle>
								<hr className="w-full border-gray-500 mb-5" />
								<div className="relative mb-4">
									<Input
										type="tel"
										placeholder="Enter phone number"
										value={phoneNumber}
										onChange={handleInputChange}
										onKeyDown={handleKeyDown}
										className="w-full py-[22px] pl-10 pr-10 bg-[#fff] border border-[#545454] rounded-lg text-gray-900 focus:outline-none placeholder-[#828282]"
									/>
									<Search className="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
									<Button
										onClick={handleSearch}
										disabled={findUserLoading || friendshipStatus === "loading"}
										size="sm"
										className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700"
									>
										{findUserLoading || friendshipStatus === "loading" ? "Searching..." : "Search"}
									</Button>
								</div>
								<div className="mt-4 min-h-[80px]">
									{(findUserLoading || friendshipStatus === "loading") && !apiError && (
										<div className="flex justify-center items-center p-4">
											<div className="loader"></div>
										</div>
									)}
									{apiError && <div className="text-center text-red-400 p-4">{apiError}</div>}
									{!findUserLoading && friendshipStatus !== "loading" && !apiError && foundUser && searchTriggered && (
										<div className="bg-white rounded-lg p-3 flex items-center justify-between space-x-3 shadow">
											<div className="flex items-center space-x-3 overflow-hidden">
												<Image
													src={foundUser.avatar || Images.AvatarDefault}
													alt={foundUser.name || "User"}
													width={40}
													height={40}
													className="rounded-full flex-shrink-0 object-cover"
												/>
												<p className="text-black font-medium truncate">{foundUser.name}</p>
											</div>
											<div className="flex-shrink-0">{renderFriendStatusButton()}</div>
										</div>
									)}
									{!findUserLoading && friendshipStatus === "not_found" && searchTriggered && !apiError && (
										<div className="text-center text-gray-400 p-4">User not found.</div>
									)}
									{!searchTriggered && friendshipStatus === "idle" && !findUserLoading && !apiError && (
										<div className="text-center text-gray-400 p-4">Enter a phone number to find a friend.</div>
									)}
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
export default ModalFindFriend
