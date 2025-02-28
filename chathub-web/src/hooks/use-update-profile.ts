import { useState, useCallback } from "react";
import { ChangeProfileRequest } from "~/codegen/data-contracts";
import { updateProfile as updateProfileAPI } from "~/lib/get-update-profile";
import { toast } from "react-toastify";

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
