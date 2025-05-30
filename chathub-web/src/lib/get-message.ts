import { MessageResponse, ReactionRequest } from "~/codegen/data-contracts"
import { Message } from "~/codegen/Message"

const messageInstance = new Message({ baseUrl: process.env.NEXT_PUBLIC_API_URL })

export const getMessageByConversationId = async (conversationId: number, userId: number, token: string) => {
  try {
    if (!conversationId) return null
    const response = (await messageInstance
      .getMessages(
        conversationId,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => res.json())) as MessageResponse[]
    return response
  } catch (error) {
    return null
  }
}

export const unsendMessage = async (userId: number, messageId: number, token: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/message/unsent?userId=${userId}&messageId=${messageId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const text = await res.text()
    return text // "Message unsent successfully."
  } catch (error) {
    return null
  }
}

export const deleteMessage = async (userId: number, messageId: number, token: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/message/delete?userId=${userId}&messageId=${messageId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const text = await res.text()
    return text // "Message deleted successfully."
  } catch (error) {
    return null
  }
}

export const forwardMessage = async (
  senderId: number,
  originalMessageId: number,
  conversationIds: number[],
  token: string,
  message: string | null = null,
): Promise<MessageResponse[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/message/forward?senderId=${senderId}&originalMessageId=${originalMessageId}&` +
        conversationIds.map(id => `conversationIds=${id}`).join("&"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: message ? JSON.stringify(message) : null,
      },
    )

    return await res.json()
  } catch (error) {
    return null
  }
}

export const reactToMessage = async (payload: ReactionRequest, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reaction/react-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error("Failed to react:", await res.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Error reacting to message:", error)
    return false
  }
}
