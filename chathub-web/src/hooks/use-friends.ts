"use client";

import { useEffect, useState } from "react";
import { FriendshipRequest, UserDTO } from "~/codegen/data-contracts";
import { getListFriends, rejectFriendRequest, unsentFriendRequest } from "~/lib/get-friend";
import { getListFriendRequest, acceptFriendRequest } from "~/lib/get-friend";

export function useFriends(userId: number, token: string) {
  const [friends, setFriends] = useState<UserDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const data = await getListFriends(userId, token);
        setFriends(data);
      } catch {
        setError("Failed to fetch friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  const getListFriendRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getListFriendRequest(userId, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequestHook = async (values: FriendshipRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await acceptFriendRequest(values, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  }

  const rejectFriendRequestHook = async (values: FriendshipRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rejectFriendRequest(values, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  }

  const unsentFriendRequestHook = async (friendId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unsentFriendRequest(userId, friendId, token);
      return response || null;
    } catch (err) {
      setError("Failed to fetch conversation");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    friends,
    loading,
    error,
    getListFriendRequests,
    acceptFriendRequestHook,
    rejectFriendRequestHook,
    unsentFriendRequestHook
  };
}
