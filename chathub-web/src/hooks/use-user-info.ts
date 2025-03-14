import { useEffect, useState } from "react"
import { UserDTO } from "~/codegen/data-contracts"
import { getUserInfo } from "~/lib/get-user-info"

export function useUserInfo(phoneNumber: string, token?: string) {
  const [userInfo, setUserInfo] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserInfo(phoneNumber, token)

        setUserInfo(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch user info.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [phoneNumber, token])

  return { userInfo, loading, error }
}
