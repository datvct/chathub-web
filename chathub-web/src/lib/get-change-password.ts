import { User } from "~/codegen/User";
import { ChangePasswordRequest, SuccessResponse, ErrorResponse } from "~/codegen/data-contracts";

const userInstance = new User({ baseUrl: process.env.API_URL });

export async function changePassword(data: ChangePasswordRequest): Promise<SuccessResponse | ErrorResponse | undefined> {
  const token = localStorage.getItem("authToken")
  try {

    const response = await userInstance.changePassword(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json() as SuccessResponse
    }

    return await response.json() as ErrorResponse

  } catch (error) {
    console.error("Error changing password:", error);
    throw error
  }
}
