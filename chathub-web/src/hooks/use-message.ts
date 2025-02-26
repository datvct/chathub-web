import { useEffect, useState } from "react";
import { MessageResponse } from "~/codegen/data-contracts";
import { getMessageByConversationId } from "~/lib/get-message";

export const useMessages = (conversationId: number, token: string) => {
    const [messages, setMessages] = useState<MessageResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!conversationId || !token) return;

        const fetchMessages = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getMessageByConversationId(conversationId, token);
                setMessages(data || []);
            } catch (err) {
                setError("Failed to fetch messages");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId, token]);

    return { messages, loading, error };
};
