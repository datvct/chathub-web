import { Auth } from "~/codegen/Auth";
import { RegistrationRequest, SuccessResponse, ErrorResponse } from "~/codegen/data-contracts";

const authInstance = new Auth({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

export async function signUp(data: RegistrationRequest) {
  try {
    const response = await authInstance.register(data);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw error; 
  }
}