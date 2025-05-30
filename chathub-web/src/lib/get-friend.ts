import { Friend } from "~/codegen/Friend"
import { FriendRequestResponse, FriendshipRequest, SuccessResponse, UserDTO } from "~/codegen/data-contracts"

const friendInstance = new Friend({ baseUrl: process.env.NEXT_PUBLIC_API_URL })

export async function getListFriendRequest(userId: number, token: string) {
  try {
    if (!userId) return null

    const response = (await friendInstance
      .getListFriendRequest(
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as FriendRequestResponse[]

    return response
  } catch (error) {
    return null
  }
}

export async function getListFriends(userId: number, token: string) {
  try {
    if (!userId) return null

    const response = (await friendInstance
      .getListFriend(
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as UserDTO[]

    return response
  } catch (error) {
    return null
  }
}

export async function acceptFriendRequest(data?: FriendshipRequest, token?: string) {
  try {
    if (!data) return null

    const response = (await friendInstance
      .acceptFriendRequest(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    return null
  }
}

export async function rejectFriendRequest(data?: FriendshipRequest, token?: string) {
  try {
    if (!data) return null

    const response = (await friendInstance
      .rejectFriendRequest(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    return null
  }
}

export async function unsentFriendRequest(userId: number, friendId: number, token: string) {
  try {
    if (!userId && !friendId) return null

    const response = (await friendInstance
      .unsentFriendRequest(
        { userId, friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    return null
  }
}

export async function sendFriendRequest(data: FriendshipRequest, token: string): Promise<SuccessResponse> {
  try {
    if (!data || !token) throw new Error("Request data and Token are required")

    const response = await friendInstance.sendFriendRequest(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }))

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    const successData = (await response.json()) as SuccessResponse
    return successData
  } catch (error: any) {
    throw error
  }
}
