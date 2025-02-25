import { Conversation } from "~/codegen/Conversation"
import { ConversationRequest, ConversationResponse, SuccessResponse } from "~/codegen/data-contracts"

const conversationInstance = new Conversation({ baseUrl: process.env.API_URL })

export async function getConversationByUserID(userId: number) {
  const token = localStorage.getItem("authToken")
   try {
    if (!userId) return null

    const response = (await conversationInstance.getRecentConversations({userId}, {
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

export async function createConversationAPI(data: ConversationRequest, token:string) {
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


export async function leaveConversation(conversationId:number, userId:number, token?:string){
  try {
    const response = (await conversationInstance.leaveGroupConversation(conversationId,{userId: userId},{
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

export async function putDissolveGroup(conversationId:number, userId:number, token?:string){
  try {
  
    const response = (await conversationInstance.dissolveGroupConversation(conversationId,{userId: userId},{
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