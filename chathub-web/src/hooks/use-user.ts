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
  searchUserByNameOrPhone,
  findUserByPhoneNumber,
  findUserById,
  searchUsersAPI,
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

export function useSearchUserByNameOrPhone() {
  const [users, setUsers] = useState<UserDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (userId: number, query: string, token: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await searchUserByNameOrPhone(userId, query, token);
        setUsers(response);
      } catch (err) {
        console.error("Error searching user by name or phone:", err);
        setError("Failed to search users");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { users, loading, error, search };
}

export function useFindUserById() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findById = useCallback(
    async (userId: number, token: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await findUserById(userId, token);
        setUser(response);
      } catch (err) {
        console.error("Error finding user by ID:", err);
        setError("Failed to find user by ID");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { user, loading, error, findById };
}

export const useUserSearch = (userId: number, token: string) => {
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchUsersAPI(userId, query, token);
      setSearchResults(results);
    } catch (err: any) {
      console.error("Search user error:", err);
      setSearchError("Failed to search users.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [userId, token]);

  return { searchUsers, searchResults, isSearching, searchError };
};
