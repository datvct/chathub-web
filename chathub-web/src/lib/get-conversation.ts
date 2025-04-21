import { Conversation } from "~/codegen/Conversation"
import {
  ConversationRequest,
  ConversationResponse,
  MessageFindedResponse,
  SuccessResponse,
  ChatDetailSectionResponse,
  UpdateGroupInfoRequest,
  UpdateNickNameRequest,
} from "~/codegen/data-contracts"

const conversationInstance = new Conversation({ baseUrl: process.env.API_URL })

export async function getRecentConversationByUserID(userId: number, token: string) {
  try {
    if (!userId) return null

    const response = (await conversationInstance
      .getRecentConversations(
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as ConversationResponse[]
    return response
  } catch (error) {
    return null
  }
}

export async function createConversationAPI(data: ConversationRequest, token: string) {
  try {
    if (!data || !data.chatType) {
      throw new Error("Chat type is required.")
    }

    const response = await conversationInstance.createConversation(
      { request: { ...data } },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    throw error
  }
}

export async function putDissolveGroup(conversationId: number, userId: number, token?: string) {
  try {
    const response = (await conversationInstance
      .dissolveGroupConversation(
        conversationId,
        { userId: userId },
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

export async function getGroupConversationsByUserId(userId: number, token: string) {
  try {
    if (!userId) return null
    const response = (await conversationInstance
      .getGroupConversations(
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as ConversationResponse[]
    return response
  } catch {
    return null
  }
}

export async function findMessagesByConversationId(conversationId: number, message: string, token: string) {
  try {
    if (!conversationId || !message) return null
    const response = (await conversationInstance
      .findMessage(
        conversationId,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as MessageFindedResponse[]
    return response
  } catch (error) {
    return null
  }
}

export const getChatDetailSectionAPI = async (conversationId: number, userId: number, token: string) => {
  try {
    const response = (await conversationInstance
      .getChatDetailSection(
        conversationId,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as ChatDetailSectionResponse
    return response
  } catch (error) {
    return null
  }
}

export const updateGroupInfoAPI = async (
  conversationId: number,
  userId: number,
  groupName: string,
  avatarFile: File | null,
  token: string,
): Promise<SuccessResponse | null> => {
  try {
    const formData = new FormData()
    formData.append("userId", userId.toString())
    formData.append("groupName", groupName)
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }

    const response = await fetch(`${process.env.API_URL}/conversation/${conversationId}/updateGroupInfo`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }))
      throw new Error(errorData.message || `Failed to update group info. Status: ${response.status}`)
    }

    const successResponse = (await response.json()) as SuccessResponse
    return successResponse
  } catch (error: any) {
    throw new Error(error.message || "An unexpected error occurred while updating group info.")
  }
}

export const pinConversationAPI = async (conversationId: number, userId: number, isPinned: boolean, token: string) => {
  try {
    const response = await conversationInstance.pinConversation(
      conversationId,
      { userId, isPinned },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error: any) {
    return null
  }
}

export const unpinConversationAPI = async (
  conversationId: number,
  userId: number,
  isPinned: boolean,
  token: string,
) => {
  try {
    const response = await conversationInstance.pinConversation(
      conversationId,
      { userId, isPinned },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return { success: true, data: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to unpin conversation",
    }
  }
}

export const dissolveGroupConversationAPI = async (conversationId: number, userId: number, token: string) => {
  try {
    const response = (await conversationInstance
      .dissolveGroupConversation(
        conversationId,
        { userId },
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

export const deleteConversationAPI = async (conversationId: number, userId: number, token: string) => {
  try {
    const response = (await conversationInstance
      .deleteConversation(
        conversationId,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as SuccessResponse
    return { success: true, data: response }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to delete conversation",
    }
  }
}

export const addMembersToConversationAPI = async (conversationId: number, memberIds: number[], token: string) => {
  try {
    const response = (await conversationInstance
      .addMembersToConversation(conversationId, memberIds, {
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

export const removeParticipantFromGroupConversationAPI = async (
  conversationId: number,
  userId: number,
  participantId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance
      .removeParticipantFromGroupConversation(
        conversationId,
        { userId, participantId },
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

export const leaveGroupConversationAPI = async (
  conversationId: number,
  userId: number,
  token: string,
  newOwnerId?: number,
) => {
  try {
    const response = (await conversationInstance
      .leaveGroupConversation(
        conversationId,
        { userId, newOwnerId: newOwnerId ?? null },
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

export async function findGroupsAPI(userId: number, groupName: string, token: string) {
  try {
    if (!userId) return []
    const response = await conversationInstance.findGroupConversations(
      { userId, groupName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data || []
  } catch (error) {
    return []
  }
}

export const updateNicknameAPI = async (data: UpdateNickNameRequest, token: string) => {
  try {
    const response = (await conversationInstance
      .updateNickname(data, {
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

export const findSingleChat = async (userId: number, friendId: number, token: string) => {
  try {
    const response = (await conversationInstance
      .findSingleChat(
        { userId, friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as ConversationResponse
    return response
  } catch (error) {
    return null
  }
}

export const updateGrantDeputyGroup = async (
  conversationId: number,
  userId: number,
  adminId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance
      .grantDeputy(
        conversationId,
        { userId, adminId },
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

export const revokeDeputyGroup = async (conversationId: number, userId: number, adminId: number, token: string) => {
  try {
    const response = (await conversationInstance
      .revokeDeputy(
        conversationId,
        { userId, adminId },
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
