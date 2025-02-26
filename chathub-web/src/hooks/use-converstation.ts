import { useState } from "react";
import { ConversationRequest } from "~/codegen/data-contracts";
import { getRecentConversationByUserID, createConversationAPI, leaveConversation, putDissolveGroup, getGroupConversationsByUserId } from "~/lib/get-conversation";

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


  return { getRecentConversation, createConversation, leaveConversationById, dissolveGroup, getGroupConversations,loading, error };
};
