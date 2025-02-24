import { RegistrationRequest } from "~/codegen/data-contracts"

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
      if (response.statusCode === 200) return { success: true }
      else {
        // throw new Error(response.message)
        return { success: false, error: response.message }
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong, please try again later.")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { submitRegister, loading, errorMessage }
}
