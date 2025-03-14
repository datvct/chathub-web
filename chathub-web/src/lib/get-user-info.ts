import { User } from "~/codegen/User";
import { UserDTO } from "~/codegen/data-contracts";

const userInstance = new User({ baseUrl: process.env.API_URL });

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
