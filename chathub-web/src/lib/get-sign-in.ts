import { Auth } from "~/codegen/Auth"
import { AuthRequest, AuthResponse } from "~/codegen/data-contracts"

const signInInstance = new Auth({ baseUrl: process.env.API_URL })

export async function signIn(data?: AuthRequest) {
  try {
    if (!data) return null

    const response = (await signInInstance.login(data).then(res => res.json())) as AuthResponse
    return response
  } catch (error) {
    console.error("Error checking admin token:", error)
    return null
  }
}
