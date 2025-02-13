import { AuthRequest } from "~/codegen/data-contracts"
import { signIn } from "~/lib/get-sign-in"

export const useSignUp = () => {
  const submitSignUp = async (values: AuthRequest) => {
    try {
      const response = await signIn(values)
      console.log("response", response)
      if (response?.userId) {
        return { status: 200, isSuccess: true, response }
      } else {
        throw new Error("Failed to submit rating")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return { status: 400, isSuccess: false }
    }
  }
  return { submitSignUp }
}
