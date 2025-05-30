import { User } from "~/codegen/User"
import { UserDTO, BlockRequest, ChangeProfileRequest, SuccessResponse } from "../codegen/data-contracts"

const userInstance = new User({ baseUrl: process.env.NEXT_PUBLIC_API_URL })

export async function updateProfile(data: ChangeProfileRequest, token: string) {
  try {
    if (!data.id) return null
    const response = (await userInstance.updateProfile(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })) as SuccessResponse
    return response
  } catch (error) {
    throw error
  }
}

export async function findByPhoneNumber(phoneNumber: string) {
  try {
    const response = (await userInstance.findUserByPhoneNumber({ phoneNumber }).then(res => res.json())) as UserDTO
    return response
  } catch (error) {
    return null
  }
}

export async function findUserById(userId: number, token: string) {
  try {
    const response = (await userInstance
      .findUserByUserId(userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())) as UserDTO
    return response
  } catch (error) {
    return null
  }
}

export async function blockUser(blockerId: number, blockedId: number, token: string) {
  try {
    const response = await userInstance.blockUser({ blockerId, blockedId } as BlockRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    throw error
  }
}

export async function unblockUser(blockerId: number, blockedId: number, token: string) {
  try {
    const response = await userInstance.unblockUser({ blockerId, blockedId } as BlockRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    throw error
  }
}

export async function findUserByIdAPI(userId: number, token: string): Promise<UserDTO | null> {
  try {
    if (!userId) return null
    const response = await userInstance.findUserByUserId(userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data || null
  } catch (error) {
    return null
  }
}
