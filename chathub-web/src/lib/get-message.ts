import { MessageResponse } from "~/codegen/data-contracts"
import { Message } from "~/codegen/Message"

const messageInstance = new Message({ baseUrl: process.env.API_URL })

export const getMessageByConversationId = async (conversationId: number, userId: number, token: string) => {
  try {
    console.log(token)
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
    console.error("Error checking admin token:", error)
    return null
  }
}
