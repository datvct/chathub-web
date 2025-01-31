"use client"
import Image from "next/image"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"
import Link from "next/link"

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

<<<<<<< HEAD
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
=======
  const isFormValid = phoneNumber !== "" && password !== ""
>>>>>>> chat-56

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <Image 
        src={Images.Background} 
        alt="background-image" 
        layout="fill" 
        objectFit="cover" 
      />
      <div className="absolute inset-0 bg-black opacity-50" />

<<<<<<< HEAD
                            <Input
                                type="text"
                                id="phone"
                                placeholder="Number phone"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
=======
      <div className="z-20 bg-black bg-opacity-55 p-8 rounded-[20px] w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-[45px] font-bold text-white mb-3">SIGN IN</h2>

        <div className="w-full mb-5 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={Images.IconPhone} alt="phone icon" width={22} height={22} />
          </div>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Phone Number"
            className="w-full py-[22px] pl-12 pr-4 text-lg text-black rounded-lg"
          />
        </div>
>>>>>>> chat-56

        <div className="w-full mb-3 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={Images.IconPassword} alt="password icon" width={22} height={22} />
          </div>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full py-[22px] pl-12 pr-4 text-lg text-black rounded-lg"
          />
        </div>

        <div className="w-full flex justify-between mb-5">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="rounded text-primary focus:ring-primary" />
            <label htmlFor="remember" className="ml-2 text-[16px] cursor-pointer text-white">
              Remember Me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-white underline ml-2 hover:text-[#3E70A1]">
            Forgot Password?
          </Link>
        </div>

<<<<<<< HEAD
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
=======
        <Button
          onClick={handleSubmit}
          className={`w-full py-4 text-lg text-white rounded-[12px] bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid} 
        >
          Sign In
        </Button>

        <hr className="w-3/4 my-4 border-1 border-gray-500" />

        <div className="text-white text-[14px] uppercase">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#3E70A1] hover:underline font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
>>>>>>> chat-56
}

export default SignInPage
