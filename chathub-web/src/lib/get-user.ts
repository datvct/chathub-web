import { UserDTO } from "~/codegen/data-contracts";
import { User } from "~/codegen/User";

const userInstance = new User({ baseUrl: process.env.API_URL });

export async function getListFriends(userId: number, token: string) {


  try {
    if (!userId) return null

    const response = (await friendInstance.getListFriend({ userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as UserDTO[]
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}
