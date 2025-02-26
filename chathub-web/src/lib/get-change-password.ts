import { User } from "~/codegen/User"
import { ChangePasswordRequest, SuccessResponse, ErrorResponse } from "~/codegen/data-contracts"

const userInstance = new User({ baseUrl: process.env.API_URL })

export async function changePassword(data: ChangePasswordRequest) {
  const token = localStorage.getItem("authToken")
  try {
    const response = await userInstance.changePassword(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorResponse = (await response.json()) as ErrorResponse
      throw { status: response.status, message: errorResponse.message }
    }

    const successResponse: SuccessResponse = await response.json()

    return successResponse || null
  } catch (error: any) {
    return { status: error.status, error: { message: error.message } }
  }
}
