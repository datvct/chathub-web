import { useState } from "react"
import { ChangePasswordRequest, SuccessResponse, ErrorResponse } from "../codegen/data-contracts"
import { changePassword as changePasswordApi } from "../lib/get-change-password" 

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const changePassword = async (data: ChangePasswordRequest) => {
    setLoading(true)
    setErrorMessage("")

    try {
      const response = await changePasswordApi(data)
      console.log("Change password response: ", response)
      if (response.statusCode == 200) return { success: true }
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
