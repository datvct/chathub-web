import { UserDTO } from "~/codegen/data-contracts";
import { User } from "~/codegen/User";
import { ChangeProfileRequest, SuccessResponse } from "../codegen/data-contracts";

const userInstance = new User({ baseUrl: process.env.API_URL });

<<<<<<<<< Temporary merge branch 1
export async function updateProfile(data: ChangeProfileRequest, token: string) {
=========
export async function getListFriends(userId: number, token: string) {


>>>>>>>>> Temporary merge branch 2
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
=========
export async function findByPhoneNumber(phoneNumber: string, token?: string) {
    try {
        const response = (await userInstance.findUserByPhoneNumber({ phoneNumber }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.json())) as UserDTO
        return response
    } catch (error) {
        console.error("Error checking admin token:", error)
        return null
    }
>>>>>>>>> Temporary merge branch 2
}
