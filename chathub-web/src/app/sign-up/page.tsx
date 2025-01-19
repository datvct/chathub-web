"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"

const SignUpPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullName, setFullName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [agreeSocialTerms, setAgreeSocialTerms] = useState(false)

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    }

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = () => {
        console.log("Phone:", phoneNumber, "Full name:", fullName, "Password:", password, "Confirm password:", confirmPassword, "Terms:", agreeTerms, "Social terms:", agreeSocialTerms)
    }


    return (
        <>
            <div className="h-full w-full flex items-center justify-center bg-secondary text-white bg-gradient-to-r from-[#1A004C] to-[#160430] relative"> {/* Sử dụng relative để các phần tử con có thể định vị tuyệt đối */}
                <div className="w-3/5 max-h-svh">
                    <Image
                        src={Images.Background}
                        alt="background-image"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="inset-0 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80" />
                </div>

                <div className="w-2/5 min-h-svh p-6 rounded-lg  flex flex-col justify-center z-50">
                    <h1 className="text-[60px] text-center font-bold mb-10">
                        SIGN UP
                    </h1>

                    <div className="flex flex-col justify-center items-center gap-5">
                        <div className="relative w-3/4"> {/* Input số điện thoại */}
                            <Image src={Images.IconPhone} alt="icon-phone" width={20} height={20} className="absolute left-3 top-[33%]" />
                            <Input
                                type="text"
                                id="phone"
                                placeholder="Number phone"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="relative w-3/4"> {/* Input Full Name */}
                            <Image src={Images.IconUser} alt="icon-full-name" width={20} height={20} className="absolute left-3 top-[33%]" /> {/* Icon full name (thay bằng icon phù hợp) */}
                            <Input
                                type="text"
                                id="fullName"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={handleFullNameChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="relative w-3/4"> {/* Input mật khẩu */}
                            <Image src={Images.IconPassword} alt="icon-password" width={20} height={20} className="absolute left-3 top-[33%]" />
                            <Input type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="relative w-3/4"> {/* Input Confirm password */}
                            <Image src={Images.IconPassword} alt="icon-password" width={20} height={20} className="absolute left-3 top-[33%]" />
                            <Input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            className="w-3/4 h-[50px] py-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white text-[20px] rounded-md transition hover:bg-none hover:bg-[#5C3BFF]"> {/* Nút đăng ký */}
                            Sign up
                        </Button>

                        <div className="flex flex-col w-3/4 gap-2.5">
                            <div className="flex items-center">
                                <input
                                    type="checkbox" 
                                    id="agreeTerms" 
                                    checked={agreeTerms} 
                                    onChange={e => setAgreeTerms(e.target.checked)}
                                    className="rounded text-pink-600 bg-[#261046] focus:ring-primary" 
                                />
                                <label htmlFor="agreeTerms" className="ml-2 text-[16px] cursor-pointer">
                                    I agree to the terms of use <span className="text-[#489DA6]">terms of use</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="agreeSocialTerms" 
                                    checked={agreeSocialTerms} 
                                    onChange={e => setAgreeSocialTerms(e.target.checked)} 
                                    className="rounded bg-[#261046] text-primary focus:ring-primary"
                                />
                                <label htmlFor="agreeSocialTerms" className="ml-2 text-[16px] cursor-pointer">
                                    I agree to the social network terms <span className="text-[#489DA6]">social network terms</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-5 w-3/4 h-[1px] bg-white"></div> 
                        <div className="text-center mt-4">
                            <p className="text-[18px] text-[#B6B6B6] font-semibold">
                                HAVE AN ACCOUNT?
                                <Link href="/sign-in" className="pl-2 font-extrabold text-white underline ml-2 hover:no-underline">
                                    SIGN IN
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUpPage