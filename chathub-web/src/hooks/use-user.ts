import { useState, useCallback } from "react"
import { ChangeProfileRequest } from "~/codegen/data-contracts"
import {
  updateProfile as updateProfileAPI,
  blockUser as blockUserAPI,
  unblockUser as unblockUserAPI,
} from "~/lib/get-user"

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const updateProfile = useCallback(async (values: ChangeProfileRequest, token: string) => {
    setLoading(true)
    setErrorMessage("")

    try {
      const response = await updateProfileAPI(values, token)
      return response || null
    } catch (error) {
      console.error("Update profile error: ", error)
      const errorMsg = error.message || "Something went wrong. Please try again later!"
      setErrorMessage(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProfile, loading, errorMessage }
}

export const useBlockUnblockUser = (userId: number, token: string) => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const blockUser = async (blockerId: number, blockedId: number, token: string) => {
    setLoading(true)
    setErrorMessage("")
    try {
      const response = await blockUserAPI(blockerId, blockedId, token)
      return response
    } catch (error) {
      console.error("Error blocking user:", error)
      setErrorMessage("Failed to block user.")
      return null
    } finally {
      setLoading(false)
    }
  }

  const unblockUser = async (blockerId: number, blockedId: number, token: string) => {
    setLoading(true)
    setErrorMessage("")
    try {
      const response = await unblockUserAPI(blockerId, blockedId, token)
      return response
    } catch (error) {
      console.error("Error unblocking user:", error)
      setErrorMessage("Failed to unblock user.")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { blockUser, unblockUser, loading, errorMessage }
}
