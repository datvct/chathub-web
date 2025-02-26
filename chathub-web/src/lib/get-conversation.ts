import { Conversation } from "~/codegen/Conversation"
import { ConversationRequest, ConversationResponse, SuccessResponse } from "~/codegen/data-contracts"

const conversationInstance = new Conversation({ baseUrl: process.env.API_URL })

<<<<<<< HEAD
export async function getConversationByUserID(userId: number) {
  const token = localStorage.getItem("authToken")
  try {
=======
export async function getRecentConversationByUserID(userId: number, token: string) {
   try {
>>>>>>> ea19d2ec8f644d12fe0b84c21300b59284efd1a0
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

export async function getGroupConversationsByUserId(userId: number, token: string) {
  try {
    if (!userId) return null
    const response = (await conversationInstance.getGroupConversations({userId: userId}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())) as ConversationResponse[]
    return response
  }
  catch  {
    return null
  }
}