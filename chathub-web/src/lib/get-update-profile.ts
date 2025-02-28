import { User } from "../codegen/User";
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
