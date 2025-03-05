import { UserDTO } from "~/codegen/data-contracts";
import { User } from "~/codegen/User";
import { ChangeProfileRequest, SuccessResponse } from "../codegen/data-contracts";

const userInstance = new User({ baseUrl: process.env.API_URL });

export async function updateProfile(data: ChangeProfileRequest, token: string) {
  try {
    if (!data.id) return null;
    const response = await userInstance.updateProfile(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function getUserInfo(phoneNumber: string, token?: string) {
  try {
    const response = await userInstance.findUserByPhoneNumber(
      { phoneNumber },
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    const userData: UserDTO = response.data;
    return userData || null;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
