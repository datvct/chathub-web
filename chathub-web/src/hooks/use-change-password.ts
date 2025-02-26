import { useState } from "react";
import { ChangePasswordRequest } from "~/codegen/data-contracts";
import { changePassword } from "~/lib/get-change-password";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await changePassword(data);
      if (!response || (response as any)?.errorCode) {
        throw new Error((response as any)?.message || "Change password failed");
      }
      return { success: true, data: response as any };
    } catch (error: any) {
      setError(error.message);
      console.error("Error in change password hook: ", error);
      return { success: false, error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword: handleChangePassword, loading, error };
};
