import { User } from "../codegen/User"
import { ChangePasswordRequest, SuccessResponse } from "../codegen/data-contracts"

const userInstance = new User({ baseUrl: process.env.API_URL })

export async function changePassword(data: ChangePasswordRequest) {
  try {
    if (!data.id) return null
    const response = (await userInstance.changePassword(data).then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    console.error("Error changing password: ", error)
    throw error
  }
}
