import { useCallback, useState } from "react"
import { UserDTO } from "~/codegen/data-contracts"
import { findByPhoneNumber } from "~/lib/get-user"

interface CheckPhoneNumberResult {
  isSuccess: boolean
}

export function useFindUserByPhoneNumber() {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkPhoneNumber = useCallback(async (phoneNumber: string): Promise<CheckPhoneNumberResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await findByPhoneNumber(phoneNumber)
      if (!response) {
        setError("User not found")
        return { isSuccess: false }
      }

      setUser(response)
      return { isSuccess: true }
    } catch (error) {
      setError("An error occurred while checking the phone number")
      return { isSuccess: false }
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading, error, checkPhoneNumber }
}
