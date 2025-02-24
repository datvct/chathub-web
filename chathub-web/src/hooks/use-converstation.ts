import { useState } from "react";
import { ConversationRequest } from "~/codegen/data-contracts";
import { getConversationByUserID, createConversationAPI } from "~/lib/get-conversation";

export const useConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConversation = async (id: number, token:string) => {
    setLoading(true);
    setError(null);
    try {   
      const response = await getConversationByUserID(id);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (data: ConversationRequest, token:string) => {
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

  return { getConversation, createConversation, loading, error };
};
