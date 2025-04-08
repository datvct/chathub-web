import { useState, useCallback } from "react";
import {
  UserDTO,
  ChangeProfileRequest
} from "~/codegen/data-contracts";
import {
  getUserInfo,
  updateProfile as updateProfileAPI,
  blockUser as blockUserAPI,
  unblockUser as unblockUserAPI,
  findUserByIdAPI,
} from "~/lib/get-user";

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
      return response || null;
    } catch (error) {
      console.error("Update profile error: ", error);
      const errorMsg = error.message || "Something went wrong. Please try again later!";
      setErrorMessage(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProfile, loading, errorMessage };
};

export const useBlockUnblockUser = (
  userId: number,
  token: string
) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const blockUser = async (blockerId: number, blockedId: number, token: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await blockUserAPI(blockerId, blockedId, token);
      return response;
    } catch (error) {
      console.error("Error blocking user:", error);
      setErrorMessage("Failed to block user.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (blockerId: number, blockedId: number, token: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await unblockUserAPI(blockerId, blockedId, token);
      return response;
    } catch (error) {
      console.error("Error unblocking user:", error);
      setErrorMessage("Failed to unblock user.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { blockUser, unblockUser, loading, errorMessage };
};

export const useCurrentUserProfile = (userId: number | null, token: string | null) => {
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId || !token) {

      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await findUserByIdAPI(userId, token);
      if (data) {
        setProfile(data);
      } else {
        throw new Error("User profile not found or failed to fetch.");
      }
    } catch (err: any) {
      console.error("Error fetching current user profile:", err);
      setError(err.message || "Failed to load profile.");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  return { profile, isLoading, error, fetchProfile };
};
