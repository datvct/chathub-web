import { getConversationByUserID } from "~/lib/get-conversation"


export const useConversation  = () => {
  const getConversation = async (id: number) => {
    try {   
      const response = await getConversationByUserID(id)
      if (response) {
        return response 
      } else {
        throw new Error("Failed to submit rating")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null
    }
  }
  return { getConversation }
}
