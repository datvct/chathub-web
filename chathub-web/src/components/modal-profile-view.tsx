"use client"

import React, { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Images } from "../constants/images"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useSelector } from "react-redux"
import { RootState } from "~/lib/reudx/store"
import dayjs from "dayjs"

interface ProfileData {
	displayName: string
	dateOfBirth?: string | Date
	gender: string
}

interface Friend {
	name: string
	dateOfBirth?: string | Date
	gender: "Male" | "Female"
	phone: string
	online?: boolean
	image: any
}

interface ProfileViewModalProps {
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	friend: Friend | null
}

const ProfileViewModal: React.FC<ProfileViewModalProps> = ({
	isOpen,
	setIsOpen,
	friend
}) => {
	const userId = useSelector((state: RootState) => state.auth.userId);
	const token = useSelector((state: RootState) => state.auth.token);

	const [profileData, setProfileData] = useState<ProfileData>({
		displayName: friend?.name || "",
		dateOfBirth: friend?.dateOfBirth || new Date(),
		gender: friend?.gender || "Male"
	})


	const handleChange = (field: keyof ProfileData, value: string | Date | "Male" | "Female") => {
		setProfileData(prev => ({ ...prev, [field]: value }))
	}

	const [date, setDate] = useState(dayjs(profileData.dateOfBirth))

	const handleDateOfBirth = (newDate: dayjs.Dayjs | null) => {
		setDate(newDate || dayjs())
		setProfileData(prev => ({
			...prev,
			dateOfBirth: friend?.dateOfBirth || new Date()
		}))
	}

	useEffect(() => {
		setProfileData({
			displayName: friend?.name || "",
			dateOfBirth: friend?.dateOfBirth || new Date(),
			gender: friend?.gender || "Male"
		})
	}, [friend]);

	return (
		<Transition appear show={isOpen} as={React.Fragment}>
			<Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
				<TransitionChild
					as={React.Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
				</TransitionChild>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild
							as={React.Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[5%] bg-white p-6 text-left align-middle shadow-xl transition-all">
								<DialogTitle
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
								>
									<span className="text-[25px] font-bold">Profile</span>
									<button onClick={() => setIsOpen(false)}>
										<Image src={Images.IconClosePurple} alt="close modal" width={40} height={40} />
									</button>
								</DialogTitle>

								<div className="mt-2">
									<div className="relative">
										<label htmlFor="profile-upload" className="relative cursor-pointer">
											<Image
												src={friend?.image ?? Images.ProfileImage}
												alt="profile default"
												width={100}
												height={100}
												className="mx-auto cursor-pointer w-24 h-24 rounded-[50px] border border-white transition duration-150 transform hover:scale-105 shadow-2xl hover:shadow-cyan"
											/>
											<span className="absolute bottom-[-10px] left-[55%] rounded-[50px] bg-[#F1F1F1] hover:bg-slate-300 w-[37px] h-[37px] flex items-center justify-center">
												<Camera className="text-[#797979] w-5 h-5" strokeWidth={1.5} />
											</span>
										</label>
									</div>

									<div className="mt-4">
										<label htmlFor="display-name" className="block text-sm font-medium text-black">
											Display Name
										</label>

										<div className="mt-1">
											<Input
												id="display-name"
												type="text"
												value={friend?.name}
												className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
												onChange={e => handleChange("displayName", e.target.value)}
											/>
										</div>
									</div>

									<div className="mt-4 relative">
										<label htmlFor="date-of-birth" className="block text-sm font-medium text-black">
											Date of Birth
										</label>

										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DemoContainer components={["DatePicker"]}>
												<DatePicker
													label="Date of Birth"
													value={friend ? dayjs(friend.dateOfBirth) : null}
													onChange={handleDateOfBirth}
													readOnly
													className="w-full block bg-white border border-slate-300"
												/>
											</DemoContainer>
										</LocalizationProvider>
									</div>

									<div className="mt-4">
										<label className="block text-sm font-medium text-black">Gender</label>

										<div className="mt-2">
											<div className="flex items-center gap-x-3 mb-2.5">
												<input
													id="male"
													type="radio"
													value="Male"
													disabled
													className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
													checked={profileData.gender === "Male"}
													onChange={() => handleChange("gender", "Male")}
												/>

												<label htmlFor="male" className="block text-sm leading-6">
													Male
												</label>
											</div>

											<div className="flex items-center gap-x-3">
												<input
													id="female"
													type="radio"
													value="Female"
													disabled
													className="w-4 h-4 text-[#6568FF] bg-gray-100 border-gray-300"
													checked={profileData.gender === "Female"}
													onChange={() => handleChange("gender", "Female")}
												/>

												<label htmlFor="female" className="block text-sm leading-6">
													Female
												</label>
											</div>
										</div>
									</div>

								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition >
	)
}

export default ProfileViewModal
