import { useState } from "react"
import { ChangePasswordRequest } from "~/codegen/data-contracts"
import { changePassword } from "~/lib/get-change-password" // Import hàm từ lib
import { toast } from "react-toastify"

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeUserPassword = async (data: ChangePasswordRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await changePassword(data) // Gọi API changePassword

      if ("status" in response && response.status !== 200) {
        setError(response.error?.message || "Password changes failed. Try again!")
        return { success: false }
      } else {
        setError(null)
        toast.success("Change password successfuly!") // Thành công!
        return { success: true }
      }
    } catch (err: any) {
      setError("Something went wrong! Please try again.")
      toast.error(error) // Báo lỗi
      console.error("An Error Occurred: ", err)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { changePassword: changeUserPassword, loading, error } // Export hàm changePassword
}
