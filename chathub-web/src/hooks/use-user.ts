import { useState, useCallback } from "react";
import { UserDTO } from "~/codegen/data-contracts";
import { findByPhoneNumber } from "~/lib/get-user";

export function useFindUserByPhoneNumber() {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkPhoneNumber = useCallback(async (phoneNumber: string, token?: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await findByPhoneNumber(phoneNumber, token);
            if (!response) {
                setError("Không tìm thấy người dùng");
                return { isSuccess: false };
            }
            setUser(response);
            return { isSuccess: true };
        } catch (err) {
            setError("Lỗi khi tìm người dùng");
            console.error("Error checking admin token:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, checkPhoneNumber };
}
