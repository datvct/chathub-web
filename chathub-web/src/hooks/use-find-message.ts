import { useState, useCallback } from 'react'
import { MessageFindedResponse } from '~/codegen/data-contracts';
import { findMessagesByConversationId } from '../lib/get-conversation';

export function useFindMessages(conversationId: number, token: string) {
    const [messages, setMessages] = useState<MessageFindedResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async (message: string) => {
        console.log(conversationId);
        if (!conversationId || !message) return;
        setLoading(true);
        setError(null);

        try {
            const response = await findMessagesByConversationId(conversationId, message, token);
            console.log(response);
            setMessages(response);
        } catch {
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, [conversationId, token]);

    return { messages, loading, error, fetchMessages };
}
