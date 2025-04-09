"use client"

import Image from "next/image"
import React, { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"
import { toast, ToastContainer } from "react-toastify"
import { useRouter, useSearchParams } from "next/navigation"
import { useChangePassword } from "~/hooks/use-change-password"
import { ChangePasswordRequest } from "~/codegen/data-contracts"

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const { changePassword } = useChangePassword()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.")
      return
    }

    if (confirmPassword !== password) {
      toast.error("New passwords do not match.")
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 6-20 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
      )
      return
    }

    const data: ChangePasswordRequest = {
      id: parseInt(userId),
      newPassword: password,
      changeType: "RESET",
    }

    const response = await changePassword(data)
    if (response.success) {
      toast.success("Rest password successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      router.push("/sign-in")
    } else {
      toast.error(response.error || "Failed to change password.")
    }
  }

  const isFormValid = password && confirmPassword

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <Image src={Images.Background} alt="background-image" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="z-20 bg-black bg-opacity-55 p-8 rounded-[20px] w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-[35px] font-bold text-white mb-3">Reset Password</h2>
        <div className="w-full mb-5 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={Images.IconPassword} alt="password icon" width={22} height={22} />
          </div>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="w-full py-[22px] pl-12 pr-4 text-lg text-black rounded-lg"
          />
        </div>

        <div className="w-full mb-4 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={Images.IconPassword} alt="password icon" width={22} height={22} />
          </div>
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm Password"
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
          Reset
        </Button>
        <ToastContainer />
      </div>
    </div>
  )
}

export default ResetPasswordPage
