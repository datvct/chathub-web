import { useState } from "react"
import { ChangePasswordRequest } from "~/codegen/data-contracts"
import { changePassword } from "~/lib/get-change-password"

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const changePassword = async (values: ChangePasswordRequest) => {
    setLoading(true)
    setErrorMessage("")

    try {
      const response = await changePassword(values)
      console.log("Change password response: ", response)
      if (response.statusCode == 200) return { success: true, data: response.data }
      else {
        return { success: false, error: response.message }
      }
    } catch (error: any) {
      console.error("Change password error: ", error)
      setErrorMessage(error.message || "Something went wrong.")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return { changePassword, loading, errorMessage } 
}
