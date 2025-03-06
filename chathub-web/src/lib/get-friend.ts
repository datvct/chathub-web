import { Friend } from "~/codegen/Friend";
import { FriendRequestResponse, UserDTO } from "~/codegen/data-contracts";

const friendInstance = new Friend({ baseUrl: process.env.API_URL });

export async function getListFriendRequest(userId: number, token: string) {
   try {
      if (!userId) return null;

      const response = (await friendInstance.getListFriendRequest(
         { userId },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      ).then(res => res.json())) as FriendRequestResponse[];

      return response;
   } catch (error) {
      console.error("Error fetching friend requests:", error);
      return null;
   }
}

export async function getListFriends(userId: number, token: string) {
   try {
      if (!userId) return null;

      const response = (await friendInstance.getListFriend(
         { userId },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      ).then(res => res.json())) as UserDTO[];

      return response;
   } catch (error) {
      console.error("Error fetching friends list:", error);
      return null;
   }
}
