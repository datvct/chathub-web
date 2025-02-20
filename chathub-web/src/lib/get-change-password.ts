import { User } from "~/codegen/User"
import { ChangePasswordRequest, SuccessResponse } from "~/codegen/data-contracts"

const userInstance = new User({ baseUrl: process.env.API_URL })

export async function changePassword (data: ChangePasswordRequest) {
  const token = localStorage.getItem("authToken")
  try {
    const response = await userInstance.changePassword(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    console.error("Error changing password: ", error);
    throw error;
  }
}
