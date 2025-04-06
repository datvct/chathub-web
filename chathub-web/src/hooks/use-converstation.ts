import { useState, useEffect } from "react";
import {
  ConversationRequest,
  UpdateNickNameRequest,
  UpdateGroupInfoRequest,
  ConversationResponse,
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
  findGroupsAPI,
} from "~/lib/get-conversation";

export const useConversation = (userId: number, token: string) => {
  const [groups, setGroups] = useState<ConversationResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchedGroups, setSearchedGroups] = useState<ConversationResponse[]>([]);
  const [searchGroupLoading, setSearchGroupLoading] = useState(false);
  const [searchGroupError, setSearchGroupError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await getGroupConversations(userId, token);
        setGroups(data);
      } catch {
        setError("Failed to fetch groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

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

  const createConversation = async (data: ConversationRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (!data.chatType) {
        throw new Error("Chat type is required.");
      }

      const response = await createConversationAPI(data, token);
      if (response) {
        return response;
      } else {
        throw new Error("Failed to create conversation");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createGroupConversation = async (data: ConversationRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (!data.chatType || data.chatType !== "GROUP") {
        throw new Error("Chat type must be 'GROUP'.");
      }

      const response = await createConversationAPI(data, token);
      if (response) {
        return response;
      } else {
        throw new Error("Failed to create group chat");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create group chat");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveConversationById = async (conversationId: number, userId: number, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      await leaveConversation(conversationId, userId, token);
    } catch (err) {
      setError("Failed to leave conversation");
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
      setError("Failed to fetch group conversations");
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

  const findGroups = async (userId: number, groupName: string, token: string) => {
    if (!groupName.trim()) {
      setSearchedGroups([]);
      setSearchGroupLoading(false);
      setSearchGroupError(null);
      return [];
    }

    setSearchGroupLoading(true);
    setSearchGroupError(null);
    try {
      const response = await findGroupsAPI(userId, groupName, token);
      console.log("findGroups Response Hook:", response);
      setSearchedGroups(response || []);
      return response || [];
    } catch (err) {
      setSearchGroupError("Failed to fetch groups");
      setSearchedGroups([]);
      return [];
    } finally {
      setSearchGroupLoading(false);
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

  return {
    groups,
    getRecentConversation,
    createConversation,
    createGroupConversation,
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
    findGroups,
    loading,
    error
  };
};
