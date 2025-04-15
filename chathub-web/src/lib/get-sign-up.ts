import { Auth } from "~/codegen/Auth"
import { RegistrationRequest, SuccessResponse } from "~/codegen/data-contracts"

const authInstance = new Auth({ baseUrl: process.env.API_URL })

export async function signUp(data: RegistrationRequest) {
  try {
    const response = (await authInstance.register(data).then(res => res.json())) as SuccessResponse
    return response
  } catch (error) {
    throw error
  }
}
