"use client" 

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"

const SignInPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = () => {
        console.log("Phone:", phoneNumber, "Password:", password)
    }

    return (
        <>
            <div className="h-full w-full flex items-center justify-center bg-secondary text-white bg-gradient-to-r from-[#1A004C] to-[#160430]">
                <div className=" w-3/5 max-h-svh">
                    <Image
                        src={Images.Background}
                        alt="background-image"
                        fill
                        className="relative max-h-svh inset-0 w-full h-full object-cover"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80" /> 
                </div>
                <div className="w-2/5 min-h-svh p-6 rounded-lg shadow-lg flex flex-col justify-center z-50">
                    <h1 className="text-[60px] text-center font-bold mb-10"> 
                        SIGN IN
                    </h1>

                    <div className="flex justify-center items-center flex-col gap-5">  
                        <div className="relative w-3/4"> {/* Input số điện thoại */}
                            <Image
                                src={Images.IconPhone}
                                alt="icon-phone"
                                width={20}
                                height={20}
                                className="absolute left-3 top-[33%]"
                            />

                            <Input
                                type="text"
                                id="phone"
                                placeholder="Number phone"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                        </div>

                        <div className="relative w-3/4"> {/* Input mật khẩu */}
                            <Image src={Images.IconPassword} alt="icon-password" width={20} height={20} className="absolute left-3 top-[33%]" />

                            <Input
                                type="password" 
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>


                        <div className="flex items-center justify-between w-3/4"> 
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="rounded bg-[#261046] text-primary focus:ring-primary" />
                                <label htmlFor="remember" className="ml-2 text-[16px] cursor-pointer">Remember Me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-white underline ml-2 hover:no-underline">Forgot Password?</Link>
                        </div>

                        <Button onClick={handleSubmit} className="w-3/4 h-[50px] py-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white text-[20px] rounded-md transition hover:bg-none hover:bg-[#5C3BFF]" > {/* Nút đăng nhập */}
                            Sign In
                        </Button>


                        <div className="mt-5 h-[1px] w-3/4 bg-white"></div>
                        <div className="text-center mt-4"> 
                            <p className="text-[18px] text-[#B6B6B6]">
                                DON'T HAVE AN ACCOUNT?
                                <Link href="/sign-up" className="pl-2 font-semibold text-white">
                                    SIGN UP
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>

            </div>


        </>
    )
}

export default SignInPage