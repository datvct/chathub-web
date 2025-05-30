/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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

export interface ForwardedMessageInfo {
  originalSenderAvatar?: string
  originalSenderName?: string
  messageType?: string
  originalContentSnapshot?: string
}

export interface MediaDTO {
  /** @format int64 */
  id?: number
  fileName?: string
  url?: string
  type?: "IMAGE" | "VIDEO" | "DOCUMENT" | "LINK"
  /** @format date-time */
  sent_at?: string
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
  avatar?: string
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LINK"
  /** @format date-time */
  sentAt?: string
  userDeleted?: boolean
  /** @format int64 */
  deletedByUserId?: number
  forwardedMessage?: ForwardedMessageInfo
  reactions?: ReactionDTO[]
  media?: MediaDTO
  unsent?: boolean
  forwarded?: boolean
}

export interface ReactionDTO {
  /** @format int64 */
  userId?: number
  senderName?: string
  reactionEmoji?: string
}

export interface UpdateGroupInfoRequest {
  /** @format int64 */
  userId?: number
  groupName?: string
  /** @format binary */
  avatar?: File
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
  conversationId?: number
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

export interface ConversationRequest {
  chatType?: "SINGLE" | "GROUP"
  groupName?: string
  /** @format binary */
  groupAvatar?: File
  /** @format int64 */
  creatorId?: number
  participantIds?: number[]
}

export interface ConversationResponse {
  /** @format int64 */
  id?: number
  chatType?: "SINGLE" | "GROUP"
  groupName?: string
  groupAvatar?: string
  senderAvatar?: string
  /** @format int64 */
  senderId?: number
  /** @format int64 */
  adminId?: number
  senderName?: string
  lastMessage?: string
  lastMessageType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LINK"
  /** @format date-time */
  lastMessageAt?: string
  userDeleted?: boolean
  isSeen?: boolean
  /** @format date-time */
  createAt?: string
  participants?: ParticipantDTO[]
  /** @format int64 */
  anotherParticipantId?: number
  anotherParticipantName?: string
  pinned?: boolean
  unsent?: boolean
  forwarded?: boolean
  dissolved?: boolean
}

export interface ParticipantDTO {
  /** @format int64 */
  id?: number
  name?: string
  role?: "ADMIN" | "DEPUTY" | "MEMBER"
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

export interface UpdateNickNameRequest {
  /** @format int64 */
  conversationId?: number
  /** @format int64 */
  participantId?: number
  nickName: string
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

export interface FriendRequestResponse {
  /** @format int64 */
  userId?: number
  name?: string
  avatar?: string
  message?: string
  type?: string
}

export interface ChatDetailSectionResponse {
  avatar?: string
  name?: string
  type?: "SINGLE" | "GROUP"
  list_media?: MediaDTO[]
  members?: MemberDTO[]
}

export interface MemberDTO {
  /** @format int64 */
  id?: number
  name?: string
  avatar?: string
  phoneNumber?: string
  role?: "ADMIN" | "DEPUTY" | "MEMBER"
  _admin?: boolean
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
  messageType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LINK"
}
