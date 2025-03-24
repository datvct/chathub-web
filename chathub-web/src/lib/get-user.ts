import { User } from "~/codegen/User";
import { 
  UserDTO, 
  BlockRequest,
  ChangeProfileRequest, 
  SuccessResponse 
} from "../codegen/data-contracts";

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

export async function blockUser(blockerId: number, blockedId: number, token: string) {
  try {
    const response = await userInstance.blockUser(
      { blockerId, blockedId } as BlockRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response; 
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
}

export async function unblockUser(blockerId: number, blockedId: number, token: string) {
  try {
    const response = await userInstance.unblockUser(
      { blockerId, blockedId } as BlockRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response; 
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
}