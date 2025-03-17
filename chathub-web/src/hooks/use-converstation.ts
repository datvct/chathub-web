import { useState } from "react";
import {
  ConversationRequest,
  UpdateNickNameRequest,
  UpdateGroupInfoRequest,
} from "~/codegen/data-contracts";
import {
  getRecentConversationByUserID,
  createConversationAPI,
  leaveConversation,
  putDissolveGroup,
  getGroupConversationsByUserId,
  getChatDetailSectionAPI,
  updateGroupInfoAPI,
  pinConversationAPI,
  unpinConversationAPI,
  dissolveGroupConversationAPI,
  deleteConversationAPI,
  addMembersToConversationAPI,
  updateNicknameAPI,
  removeParticipantFromGroupConversationAPI,
  leaveGroupConversationAPI,
} from "~/lib/get-conversation";

export const useConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecentConversation = async (id: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecentConversationByUserID(id, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (data: ConversationRequest, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createConversationAPI(data, token);
      if (response) {
        return response;
      } else {
        throw new Error("Failed to create conversation");
      }
    } catch {
      setError("Failed to create conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveConversationById = async (conversationId: number, userId: number, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveConversation(conversationId, userId, token);
      return response;
    } catch (error) {
      setError("Failed to leave conversation");
      return { statusCode: 400, message: "Failed to leave conversation" };
    } finally {
      setLoading(false);
    }
  };

  const dissolveGroup = async (conversationId: number, userId: number, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await putDissolveGroup(conversationId, userId, token);
      return response;
    } catch (error) {
      setError("Failed to dissolve group");
      return { statusCode: 400, message: "Failed to dissolve group" };
    } finally {
      setLoading(false);
    }
  };


  const getGroupConversations = async (userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGroupConversationsByUserId(userId, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  }

  const getChatDetailSection = async (conversationId: number, userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChatDetailSectionAPI(conversationId, userId, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to fetch chat detail section");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateGroupInfo = async (
    conversationId: number,
    request: UpdateGroupInfoRequest,
    token: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log("useConversation - updateGroupInfo - Token:", token);
      const response = await updateGroupInfoAPI(conversationId, request, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to update group info");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pinConversation = async (conversationId: number, userId: number, isPinned: boolean, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pinConversationAPI(conversationId, userId, isPinned, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to pin conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unpinConversation = async (conversationId: number, userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unpinConversationAPI(conversationId, userId, false, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to unpin conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const dissolveGroupConversation = async (conversationId: number, userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dissolveGroupConversationAPI(conversationId, userId, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to dissolve group conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: number, userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteConversationAPI(conversationId, userId, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to delete conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addMembersToConversation = async (conversationId: number, memberIds: number[], token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addMembersToConversationAPI(conversationId, memberIds, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to add members to conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNickname = async (data: UpdateNickNameRequest, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateNicknameAPI(data, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to update nickname");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeParticipantFromGroup = async (conversationId: number, userId: number, participantId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await removeParticipantFromGroupConversationAPI(conversationId, userId, participantId, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to remove participant from group");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroupConversation = async (conversationId: number, userId: number, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveGroupConversationAPI(conversationId, userId, token);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to leave group conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecentConversation,
    createConversation,
    leaveConversationById,
    dissolveGroup,
    getGroupConversations,
    getChatDetailSection,
    updateGroupInfo,
    pinConversation,
    unpinConversation,
    dissolveGroupConversation,
    deleteConversation,
    addMembersToConversation,
    updateNickname,
    removeParticipantFromGroup,
    leaveGroupConversation,
    loading,
    error
  };
};
