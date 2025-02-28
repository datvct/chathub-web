import { useState, useCallback } from "react";
import { ChangePasswordRequest } from "~/codegen/data-contracts";
import { changePassword as changePasswordAPI } from "~/lib/get-change-password";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const changePassword = useCallback(async (values: ChangePasswordRequest, token: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await changePasswordAPI(values, token);
      console.log("Change password response:", response);

      if (response.statusCode === 200) {
        return { success: true, data: response };
      }
      return { success: false, error: response };
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMsg = error.message || "Something went wrong, please try again later.";
      setErrorMessage(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { changePassword, loading, errorMessage };
};
