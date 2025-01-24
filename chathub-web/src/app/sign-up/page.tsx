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
    console.log(
      "Phone:",
      phoneNumber,
      "Full name:",
      fullName,
      "Password:",
      password,
      "Confirm password:",
      confirmPassword,
      "Terms:",
      agreeTerms,
      "Social terms:",
      agreeSocialTerms,
    )
  }

  const isFormValid =
    phoneNumber &&
    fullName &&
    password &&
    confirmPassword &&
    agreeTerms &&
    agreeSocialTerms

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <Image src={Images.Background} alt="background-image" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="z-20 bg-black bg-opacity-55 p-8 rounded-[20px] w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-[45px] font-bold text-white mb-3">SIGN UP</h2>

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

        <div className="w-full mb-5 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={Images.IconUser} alt="phone icon" width={22} height={22} />
          </div>
          <Input
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            placeholder="Full Name"
            className="w-full py-[22px] pl-12 pr-4 text-lg text-black rounded-lg"
          />
        </div>

        <div className="w-full mb-5 relative">
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

        <div className="w-full mb-5 relative">
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

        <div className="w-full flex flex-col gap-2.5 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="rounded text-pink-600 focus:ring-primary"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-[14px] cursor-pointer text-white">
              I agree to the <span className="text-[#489DA6]">terms of use</span>
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
            <label htmlFor="agreeSocialTerms" className="ml-2 text-[14px] cursor-pointer text-white">
              I agree to the <span className="text-[#489DA6]">social network terms</span>
            </label>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className={`w-full py-4 text-lg text-white rounded-[12px] bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid} 
        >
          Sign Up
        </Button>

        <hr className="w-3/4 my-4 border-1 border-gray-500" />
        <div className="text-white text-[14px] uppercase">
          Have an account?{" "}
          <Link href="/" className="text-[#3E70A1] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
