import { Friend } from "~/codegen/Friend";
import { FriendRequestResponse, FriendshipRequest, SuccessResponse, UserDTO } from "~/codegen/data-contracts";

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

export async function acceptFriendRequest(data?: FriendshipRequest, token?: string) {
  try {
    if (!data) return null;

    const response = (await friendInstance.acceptFriendRequest(
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.json())) as SuccessResponse;
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}

export async function rejectFriendRequest(data?: FriendshipRequest, token?: string) {
  try {
    if (!data) return null;

    const response = (await friendInstance.rejectFriendRequest(data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.json())) as SuccessResponse;
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}

export async function unsentFriendRequest(userId: number, friendId: number, token: string) {
  try {
    if (!userId && !friendId) return null;

    const response = (await friendInstance.unsentFriendRequest(
      { userId, friendId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.json())) as SuccessResponse;
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}
