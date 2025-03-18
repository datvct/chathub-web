import { Friend } from "~/codegen/Friend"
import { SuccessResponse } from "~/codegen/data-contracts"

const friendInstance = new Friend({ baseUrl: process.env.API_URL })

export const unfriend = async (token: string, userId: number, friendId: number) => {
  try {
    if (!userId) return null

    const response = await friendInstance.deleteFriend(
      { userId, friendId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const deleteData = response as unknown as SuccessResponse

    if (deleteData.statusCode === 200) {
      return "Unfriend Success"
    } else {
      return "Unfriend Failed"
    }
  } catch (error) {
    console.error("Error Unfriend:", error)
    return null
  }
}
