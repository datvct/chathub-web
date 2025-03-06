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

    const response = (await conversationInstance.getRecentConversations({ userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as ConversationResponse[]
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}

export async function createConversationAPI(data: ConversationRequest, token: string) {
  try {
    if (!data) return null

    const response = (await conversationInstance.createConversation(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as ConversationResponse[]
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}


export async function leaveConversation(conversationId: number, userId: number, token?: string) {
  try {
    const response = (await conversationInstance.leaveGroupConversation(conversationId, { userId: userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}

export async function putDissolveGroup(conversationId: number, userId: number, token?: string) {
  try {

    const response = (await conversationInstance.dissolveGroupConversation(conversationId, { userId: userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    console.error("Error dissolving group conversation:", error)
    return null
  }
}

export async function getGroupConversationsByUserId(userId: number, token: string) {
  try {
    if (!userId) return null
    const response = (await conversationInstance.getGroupConversations({ userId: userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as ConversationResponse[]
    return response
  }
  catch {
    return null
  }
}

export async function findMessagesByConversationId(conversationId: number, message: string, token: string) {
  try {
    if (!conversationId || !message) return null
    const response = (await conversationInstance.findMessage(conversationId, { message }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as MessageFindedResponse[]
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}

export const getChatDetailSectionAPI = async (
  conversationId: number,
  userId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance.getChatDetailSection(
      conversationId,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as ChatDetailSectionResponse;
    return response;
  } catch (error) {
    console.error("Error fetching chat detail section:", error);
    return null;
  }
};

export const updateGroupInfoAPI = async (
  conversationId: number,
  request: UpdateGroupInfoRequest,
  token: string,
) => {
  try {
    const response = (await conversationInstance.updateGroupInfo(
      conversationId,
      { request },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error updating group info:", error);
    return null;
  }
};

export const pinConversationAPI = async (
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
    );
    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error pinning conversation:", error);
    return { success: false, error: error.message || "Failed to pin conversation" };
  }
};

export const dissolveGroupConversationAPI = async (
  conversationId: number,
  userId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance.dissolveGroupConversation(
      conversationId,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error dissolving group conversation:", error);
    return null;
  }
};

export const deleteConversationAPI = async (
  conversationId: number,
  userId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance.deleteConversation(
      conversationId,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return null;
  }
};

export const addMembersToConversationAPI = async (
  conversationId: number,
  memberIds: number[],
  token: string,
) => {
  try {
    const response = (await conversationInstance.addMembersToConversation(
      conversationId,
      memberIds,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error adding members to conversation:", error);
    return null;
  }
};

export const updateNicknameAPI = async (
  data: UpdateNickNameRequest,
  token: string,
) => {
  try {
    const response = (await conversationInstance.updateNickname(
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error updating nickname:", error);
    return null;
  }
};

export const removeParticipantFromGroupConversationAPI = async (
  conversationId: number,
  userId: number,
  participantId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance.removeParticipantFromGroupConversation(
      conversationId,
      { userId, participantId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error removing participant:", error);
    return null;
  }
};

export const leaveGroupConversationAPI = async (
  conversationId: number,
  userId: number,
  token: string,
) => {
  try {
    const response = (await conversationInstance.leaveGroupConversation(
      conversationId,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(res => res.json())) as SuccessResponse;
    return response;
  } catch (error) {
    console.error("Error leaving group conversation:", error);
    return null;
  }
};
