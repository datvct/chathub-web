"use client"

import { useEffect, useState, useCallback } from "react"
import { FriendshipRequest, UserDTO, SuccessResponse, FriendRequestResponse } from "~/codegen/data-contracts"
import {
  getListFriends,
  rejectFriendRequest as rejectFriendRequestAPI,
  unsentFriendRequest as unsentFriendRequestAPI,
  sendFriendRequest as sendFriendRequestAPI,
  getListFriendRequest as getListFriendRequestAPI,
  acceptFriendRequest as acceptFriendRequestAPI,
} from "~/lib/get-friend"
import { toast } from "react-toastify"

export function useFriends(userId: number | null, token: string | null, isOpen?: boolean) {
  const [friends, setFriends] = useState<UserDTO[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [friendRequests, setFriendRequests] = useState<FriendRequestResponse[] | null>(null)

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false)
      setFriends([])
      return
    }

    const fetchFriends = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getListFriends(userId, token)
        setFriends(data || [])
      } catch (err: any) {
        setError("Failed to fetch friends.")
        setFriends([])
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [userId, token, isOpen])

  const getListFriendRequests = useCallback(async () => {
    if (!userId || !token) {
      setFriendRequests([])
      return []
    }
    setLoading(true)
    setError(null)
    try {
      const response = await getListFriendRequestAPI(userId, token)
      setFriendRequests(response || [])
      return response || []
    } catch (err) {
      setError("Failed to fetch friend requests.")
      console.error("Failed to fetch friend requests:", err)
      setFriendRequests([])
      return []
    } finally {
      setLoading(false)
    }
  }, [userId, token])

  const acceptFriendRequestHook = useCallback(
    async (values: FriendshipRequest): Promise<SuccessResponse | null> => {
      if (!token) {
        setError("Authentication token is missing.")
        return null
      }
      setLoading(true)
      setError(null)
      try {
        const response = await acceptFriendRequestAPI(values, token)
        if (response?.statusCode === 200) {
          toast.success("Friend request accepted!")

          await getListFriendRequests()
        } else {
          toast.error(response?.message || "Failed to accept friend request.")
        }
        return response || null
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to accept friend request."
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [token, getListFriendRequests],
  )

  const rejectFriendRequestHook = useCallback(
    async (values: FriendshipRequest): Promise<SuccessResponse | null> => {
      if (!token) {
        setError("Authentication token is missing.")
        return null
      }
      setLoading(true)
      setError(null)
      try {
        const response = await rejectFriendRequestAPI(values, token)
        if (response?.statusCode === 200) {
          toast.success("Friend request rejected.")

          await getListFriendRequests()
        } else {
          toast.error(response?.message || "Failed to reject friend request.")
        }
        return response || null
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to reject friend request."
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [token, getListFriendRequests],
  )

  // const rejectFriendRequestHook = useCallback(async (values: FriendshipRequest): Promise<SuccessResponse | null> => {
  //   if (!token) {
  //     setError("Authentication token is missing.");
  //     return null;
  //   }
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await rejectFriendRequestAPI(values, token);
  //     if (response?.statusCode === 200) {
  //       toast.success("Friend request rejected.");

  //       await getListFriendRequests();
  //     } else {
  //       toast.error(response?.message || "Failed to reject friend request.");
  //     }
  //     return response || null;
  //   } catch (err: any) {
  //     const errorMessage = err?.message || "Failed to reject friend request.";
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [token, getListFriendRequests]);

  const unsentFriendRequestHook = useCallback(
    async (friendId: number): Promise<SuccessResponse | null> => {
      if (!userId || !token) {
        setError("User ID or token is missing.")
        return null
      }
      setLoading(true)
      setError(null)
      try {
        const response = await unsentFriendRequestAPI(userId, friendId, token)
        if (response?.statusCode === 200) {
          toast.success("Friend request unsent.")

          await getListFriendRequests()
        } else {
          toast.error(response?.message || "Failed to unsent friend request.")
        }
        return response || null
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to unsent friend request."
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [userId, token, getListFriendRequests],
  )

  const sendFriendRequestHook = useCallback(
    async (data: FriendshipRequest): Promise<SuccessResponse | null> => {
      if (!token) {
        setError("Authentication token is missing.")
        return null
      }
      if (!data.senderId || !data.receiverId) {
        setError("Sender ID and Receiver ID must be provided.")
        return null
      }
      setLoading(true)
      setError(null)
      try {
        const response: SuccessResponse | null = await sendFriendRequestAPI(data, token)
        if (response?.statusCode === 200) {
          toast.success("Friend request sent!")

          await getListFriendRequests()
        } else {
          toast.error(response?.message || "Failed to send friend request.")
        }
        return response
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || "Failed to send friend request."
        console.error("Failed to send friend request:", err)
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [token, getListFriendRequests],
  )

  return {
    friends,
    friendRequests,
    loading,
    error,
    getListFriendRequests,
    acceptFriendRequestHook,
    rejectFriendRequestHook,
    unsentFriendRequestHook,
    sendFriendRequestHook,
  }
}
