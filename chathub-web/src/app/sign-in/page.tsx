"use client"
import Image from "next/image"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Images } from "~/constants/images"
import Link from "next/link"
import { useSignUp } from "~/hooks/use-login"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setUser } from "~/lib/reudx/authSlice"
import { setCookie } from "cookies-next"
const SignInPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { submitSignUp } = useSignUp()
  const router = useRouter()
  const dispatch = useDispatch()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const isFormValid = phoneNumber !== "" && password !== ""

  const handleSubmit = async () => {
    setLoading(true)
    setErrorMessage("")

    if (!isFormValid) {
      setErrorMessage("Please fill in all fields.")
      setLoading(false)
      return
    }
    if (!/^\d+$/.test(phoneNumber)) {
      setErrorMessage("Phone number must contain only digits.")
      setLoading(false)
      return
    }

    if (phoneNumber.length < 10) {
      setErrorMessage("Phone number must be at least 10 digits.")
      setLoading(false)
      return
    }

    const data = { phoneNumber, password }

    try {
      const response = await submitSignUp(data)
      console.log("Response:", response)
      if (response.status === 200) {
        dispatch(setUser({ userId: response?.response?.userId, token: response?.response?.token }))
        setCookie("authToken", response?.response?.token, { maxAge: 60 * 60 * 24 * 7 })
        setCookie("userId", response?.response?.userId, { maxAge: 60 * 60 * 24 * 7 })
        router.push("/")
      } else {
        setErrorMessage("Invalid phone number or password.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#160430] relative">
      <Image src={Images.Background} alt="background-image" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="z-20 bg-black bg-opacity-55 p-8 rounded-[20px] w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-[45px] font-bold text-white mb-3">SIGN IN</h2>

        {errorMessage && <p className="text-red-500 text-sm mb-3">{errorMessage}</p>}

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

        <Button
          onClick={handleSubmit}
          className={`w-full py-4 text-lg text-white rounded-[12px] bg-gradient-to-r from-[#501794] to-[#3E70A1] hover:bg-gradient-to-l ${
            !isFormValid || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid || loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <hr className="w-3/4 my-4 border-1 border-gray-500" />

        <div className="text-white text-[14px] uppercase">
          {`Don't have an account? `}
          <Link href="/sign-up" className="text-[#3E70A1] hover:underline font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
