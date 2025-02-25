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
  id?: number
  name: string
  /** @format binary */
  avatar?: File
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

export interface UpdateGroupInfoRequest {
  /** @format int64 */
  userId?: number
  groupName?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  /** @format int64 */
  id?: number
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

export interface ReactionRequest {
  /** @format int64 */
  messageId?: number
  /** @format int64 */
  userId?: number
  reactionEmoji?: string
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
  dissolved?: boolean
  pinned?: boolean
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

export interface FriendRequestResponse {
  /** @format int64 */
  userId?: number
  name?: string
  avatar?: string
  message?: string
  type?: string
}

export interface MessageFindedResponse {
  /** @format int64 */
  messageId?: number
  /** @format int64 */
  senderId?: number
  sender?: string
  avatar?: string
  content?: string
  /** @format date-time */
  sendAt?: string
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "EMOJI"
}
