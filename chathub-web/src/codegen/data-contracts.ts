/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResponse {
  /** @format int32 */
  errorCode?: number
  message?: string
  infoMessage?: Record<string, string>
}

export interface ChangeProfileRequest {
  /** @format int64 */
  id: number
  name: string
  avatar?: string
  /** @format date */
  dateOfBirth?: string
  /** @pattern MALE|FEMALE */
  gender?: string
}

export interface SuccessResponse {
  /** @format int32 */
  statusCode?: number
  message?: string
}

export interface ChangePasswordRequest {
  /** @format int64 */
  id: number
  oldPassword?: string
  /** @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$ */
  newPassword: string
  /** @pattern RESET|UPDATE */
  changeType?: string
}

export interface BlockRequest {
  /** @format int64 */
  blockerId: number
  /** @format int64 */
  blockedId: number
}

export interface FriendshipRequest {
  /** @format int64 */
  senderId?: number
  /** @format int64 */
  receiverId?: number
  message?: string
}

export interface ConversationResponse {
  /** @format int64 */
  id?: number
  chatType?: "SINGLE" | "GROUP"
  groupName?: string
  groupAvatar?: string
  senderAvatar?: string
  senderName?: string
  lastMessage?: string
  /** @format date-time */
  lastMessageAt?: string
  isSeen?: boolean
  /** @format date-time */
  createAt?: string
  participants?: ParticipantDTO[]
  pinned?: boolean
  dissolved?: boolean
}

export interface ParticipantDTO {
  /** @format int64 */
  id?: number
  name?: string
}

export interface ConversationRequest {
  chatType?: "SINGLE" | "GROUP"
  groupName?: string
  groupAvatar?: string
  /** @format int64 */
  creatorId?: number
  participantIds?: number[]
}

export interface RegistrationRequest {
  /** @pattern ^\+?[0-9]{10}$ */
  phoneNumber: string
  name: string
  /** @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$ */
  password: string
  avatar?: string
  /** @format date */
  dateOfBirth?: string
  /** @pattern MALE|FEMALE */
  gender?: string
}

export interface AuthRequest {
  /** @pattern ^\+?[0-9]{10}$ */
  phoneNumber: string
  password: string
}

export interface AuthResponse {
  /** @format int64 */
  userId?: number
  token?: string
  phoneNumber?: string
  name?: string
  /** @format date */
  dateOfBirth?: string
  gender?: string
}

export interface UserDTO {
  /** @format int64 */
  id?: number
  phoneNumber?: string
  name?: string
  avatar?: string
  /** @format date */
  dateOfBirth?: string
  gender?: string
  status?: string
}

export interface MessageResponse {
  /** @format int64 */
  id?: number
  /** @format int64 */
  conversationId?: number
  /** @format int64 */
  senderId?: number
  senderName?: string
  content?: string
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "EMOJI"
  /** @format date-time */
  sentAt?: string
  unsent?: boolean
}

export interface FriendRequest {
  /** @format int64 */
  id?: number
  sender?: User
  receiver?: User
  status?: "PENDING" | "ACCEPTED" | "REJECTED"
  message?: string
  /** @format date-time */
  createdAt?: string
}

export interface User {
  /** @format int64 */
  id?: number
  phoneNumber?: string
  name?: string
  password?: string
  avatar?: string
  /** @format date */
  dateOfBirth?: string
  gender?: string
  status?: "ONLINE" | "OFFLINE"
  role?: "ADMIN" | "USER"
  /** @format date-time */
  lastSeenAt?: string
}
