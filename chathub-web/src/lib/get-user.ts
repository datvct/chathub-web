import { UserDTO } from "~/codegen/data-contracts";
import { User } from "~/codegen/User";

const userInstance = new User({ baseUrl: process.env.API_URL });

export async function findByPhoneNumber(phoneNumber: string, token?: string) {
    try {
        const response = (await userInstance.findUserByPhoneNumber({ phoneNumber }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.json())) as UserDTO
        return response
    } catch (error) {
        console.error("Error checking admin token:", error)
        return null
    }
}
