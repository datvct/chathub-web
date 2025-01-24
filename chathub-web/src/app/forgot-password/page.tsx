"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import ModalOTP from "~/components/modal-otp"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"

const ForgotPasswordPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [openModal, setOpenModal] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  const handleSubmit = () => {
    console.log("Phone number submitted:", phoneNumber)
    setOpenModal(true)
  }

  const isFormValid = phoneNumber !== ""

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <Image src={Images.Background} alt="background-image" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="z-20 bg-black bg-opacity-55 p-8 rounded-[20px] w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-[35px] font-bold text-white mb-3">Forgot Password</h2>

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
        <Button
          onClick={handleSubmit}
          className={`w-full py-4 text-lg text-white rounded-[12px] bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid}
        >
          Continue
        </Button>
        <hr className="w-3/4 my-4 border-1 border-gray-500" />
        <div className="text-white text-[14px] uppercase">
          Have an account?{" "}
          <Link href="/" className="text-[#3E70A1] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
      {openModal && <ModalOTP isOpen={openModal} setIsOpen={setOpenModal} numberPhone={phoneNumber} />}
    </div>
  )
}

export default ForgotPasswordPage
