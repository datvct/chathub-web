import { useState, useCallback } from "react";
import { UserDTO, ChangeProfileRequest } from "~/codegen/data-contracts";
import { getUserInfo } from "~/lib/get-user";
import { updateProfile as updateProfileAPI } from "~/lib/get-user";
import { toast } from "react-toastify";

export function useFindUserByPhoneNumber() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPhoneNumber = useCallback(async (phoneNumber: string, token?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUserInfo(phoneNumber, token);
      if (!response) {
        setError("Không tìm thấy người dùng");
        return { isSuccess: false };
      }
      setUser(response);
      return { isSuccess: true };
    } catch (err) {
      setError("Error checking user info");
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, checkPhoneNumber };
}

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateProfile = useCallback(async (values: ChangeProfileRequest, token: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await updateProfileAPI(values, token);
      console.log("Update profile response: ", response);
      if (response.statusCode === 200) {
        toast.success("Updated profile successfully!");
        return { success: true, data: response };
      } else {
        toast.error("Failed to update profile!");
        return { success: false, error: response };
      }
    } catch (error: any) {
      console.error("Update profile error: ", error);
      const errorMsg = error.message || "Something went wrong. Please try again later!";
      setErrorMessage(errorMsg);
      toast.error("Failed to update profile!");
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProfile, loading, errorMessage };
};
