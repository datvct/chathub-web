import { RegistrationRequest } from "~/codegen/data-contracts"

interface ErrorResponse {
  message: string
}
import { signUp } from "~/lib/get-sign-up"
import { useState } from "react"

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const submitRegister = async (values: RegistrationRequest) => {
    setLoading(true)
    setErrorMessage("")

    try {
      const response = await signUp(values)
      console.log("Registration response:", response)
      if (response.status === 201) return { success: true, data: response.data }
      else {
        throw new Error((response.error as ErrorResponse)?.message || "Registration Failed.")
      }
    } catch (error: any) {
      console.log("Registration error:", error)
      setErrorMessage(error.message || "Something went wrong, please try again later.")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { submitRegister, loading, errorMessage }
}
