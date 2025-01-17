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

  return (
    <>
      <div className="h-full w-full flex items-center justify-center bg-secondary text-white bg-gradient-to-r from-[#1A004C] to-[#160430]">
        <div className=" w-3/5 max-h-svh">
          <Image
            src={Images.Background}
            alt="background-image"
            className="relative max-h-svh inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80" />
        </div>
        <div className="w-2/5 min-h-svh p-6 rounded-lg shadow-lg flex flex-col justify-center z-50">
          <h1 className="text-[60px] text-center font-bold mb-10">Forgot Password</h1>
          <div className="flex justify-center items-center flex-col gap-5 ">
            <div className="relative w-3/4">
              <Image
                src={Images.IconPhone}
                alt="icon-close"
                width={20}
                height={20}
                className="absolute left-3 top-[33%]"
              />
              <Input
                type="text"
                id="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full h-[50px] px-10 py-2 rounded-md bg-[#261046] border border-gray-600 text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-3/4 h-[50px] py-2 bg-gradient-to-r from-[#501794] to-[#3E70A1] text-white text-[20px] rounded-md transition hover:bg-none hover:bg-[#5C3BFF]"
            >
              Continue
            </Button>
            <div className="mt-5 h-[1px] w-3/4 bg-white"></div>
            <div className="text-center mt-4">
              <p className="text-[18px] text-[#B6B6B6]">
                HAVE AN ACCOUNT?
                <Link href="/sign-in" className="pl-2 font-semibold text-white">
                  SIGN IN
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {openModal && <ModalOTP isOpen={openModal} setIsOpen={setOpenModal} numberPhone={phoneNumber} />}
    </>
  )
}

export default ForgotPasswordPage
