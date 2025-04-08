"use client"

import { ConfirmationResult, RecaptchaVerifier } from "@firebase/auth"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import ModalOTP from "~/components/modal-otp"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"
import { useFindUserByPhoneNumber } from "~/hooks/use-find-user-by-phone-number"
import { auth, signInWithPhoneNumber } from "~/lib/firebase"

const removeCountryCode = (input: string) => {
  let value = input.replace(/\s/g, "") // xóa khoảng trắng

  if (value.startsWith("+84")) {
    value = "0" + value.slice(3) // thay +84 bằng 0
  }

  return value
}
const ForgotPasswordPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>()
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const { user, loading, error, checkPhoneNumber } = useFindUserByPhoneNumber()

  useEffect(() => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          console.log("reCAPTCHA verified successfully", response)
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
        },
      })
      setRecaptchaVerifier(verifier)
    }
  }, [recaptchaVerifier])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "")
    if (!value.startsWith("+84")) {
      value = "+84" + value.replace(/^0/, "")
    }
    setPhoneNumber(value)
  }

  const handleSubmit = async () => {
    if (!recaptchaVerifier) {
      console.error("RecaptchaVerifier is not initialized")
      return
    }

    if (loading) return
    await checkPhoneNumber(removeCountryCode(phoneNumber))
    console.log("User data: abs", user)
    if (!user) {
      toast.error("Phone number not found!")
      return
    }
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      setOpenModal(true)
      setConfirmationResult(confirmation)
    } catch (error) {
      console.error("Error sending OTP:", error)
    }
  }

  const handleResendOTP = async () => {
    if (!recaptchaVerifier) {
      console.error("RecaptchaVerifier is not initialized")
      return
    }

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      setConfirmationResult(confirmation)
      toast.success("OTP sent successfully!")
    } catch (error) {
      toast.success("Error resending OTP! Please try again.")
      console.error("Error resending OTP:", error)
    }
  }

  const isFormValid = phoneNumber !== ""

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <ToastContainer position="top-center" autoClose={3000} closeOnClick />
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
          className={`w-full py-4 text-lg text-white rounded-[12px] bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l
            ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
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
      {openModal && (
        <ModalOTP
          isOpen={openModal}
          setIsOpen={setOpenModal}
          numberPhone={phoneNumber}
          confirmationResult={confirmationResult}
          onResendOTP={handleResendOTP}
          userId={user?.id}
        />
      )}

      <div id="recaptcha-container"></div>
    </div>
  )
}

export default ForgotPasswordPage
