"use client"
import { useCallback, useState } from "react"
import { unfriend as unfriendAPI } from "~/lib/get-unfriend"
import { toast } from "react-toastify"

export function useUnfriend() {
  const [isUnfriending, setIsUnfriending] = useState<boolean>(false)
  const [unfriendUserId, setUnfriendUserId] = useState<number | null>(null)
  const [unfriendError, setUnfriendError] = useState<string | null>(null)
  const unfriend = useCallback(async (token: string, userId: number, friendId: number) => {
    setUnfriendError(null)
    setIsUnfriending(true)
    setUnfriendUserId(friendId)
    try {
      const res = await unfriendAPI(token, userId, friendId)
      toast.success("Unfriend successfully!")
      return res
    } catch (error: any) {
      toast.error(error?.message || "Unfriend failed!")
      setUnfriendError("Unfriend Failed")
      return error
    } finally {
      setIsUnfriending(false)
      setUnfriendUserId(null)
    }
  }, [])

  return { unfriend, isUnfriending, unfriendUserId, unfriendError }
}
