"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"

interface ModalOTPProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  numberPhone: string
}

const ModalOTP = ({ isOpen, setIsOpen, numberPhone }: ModalOTPProps) => {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [timer, setTimer] = useState(60)
  const timerRef = useRef<NodeJS.Timeout | null>(null) // Lưu trữ tham chiếu của bộ đếm

  // Tự động giảm thời gian khi timer > 0
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current) // Xóa bộ đếm khi component unmount
      }
    }
  }, [timer])

  const handleInputChange = (value: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Tự động chuyển sang input tiếp theo
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Xử lý Backspace để quay lại ô trước
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOTP = () => {
    setTimer(60) // Reset lại timer
    console.log("Resend OTP triggered!") // Xử lý logic gửi OTP ở đây
  }

  const handleSubmit = () => {
    console.log("OTP Submitted:", otp.join(""))
  }

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]) // Tham chiếu tới từng ô input

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-bold text-center uppercase">OTP Verification</DialogTitle>
        </DialogHeader>
        <div className="text-center text-[18px]">
          <div>{numberPhone}</div>
          <div>OTP has been sent to your mobile number</div>
        </div>
        <div className="flex justify-center gap-2 my-4">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              value={digit}
              maxLength={1}
              onChange={e => handleInputChange(e.target.value, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => {
                inputRefs.current[index] = el
              }}
              className="w-10 h-12 text-center text-lg font-bold rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <div className="text-center mb-4 text-sm">
          <span>({timer}s) </span>
          <button
            className="text-[#362E71]  disabled:text-gray-400"
            disabled={timer > 0} // Chỉ kích hoạt nếu timer = 0
            onClick={handleResendOTP}
          >
            <span className="font-medium">Resend OTP</span>
          </button>
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:opacity-90"
          onClick={handleSubmit}
        >
          Verify OTP
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default ModalOTP
