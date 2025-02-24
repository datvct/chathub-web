import { UserDTO } from "~/codegen/data-contracts";
import { Friend } from "~/codegen/Friend";

const friendInstance = new Friend({ baseUrl: process.env.API_URL });

export async function getListFriends(userId: number, token:string) {


   try {
    if (!userId) return null

    const response = (await friendInstance.getListFriend({userId}, {
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
