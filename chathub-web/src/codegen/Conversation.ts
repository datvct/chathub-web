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

import {
  ConversationRequest,
  ConversationResponse,
  ErrorResponse,
  MessageFindedResponse,
  SuccessResponse,
  UpdateGroupInfoRequest,
} from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class Conversation<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags conversation-controller
   * @name UpdateGroupInfo
   * @request PUT:/conversation/{conversationId}/updateGroupInfo
   * @secure
   */
  updateGroupInfo = (conversationId: number, data: UpdateGroupInfoRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/updateGroupInfo`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name PinConversation
   * @request PUT:/conversation/{conversationId}/pin
   * @secure
   */
  pinConversation = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
      isPinned: boolean
    },
    params: RequestParams = {},
  ) =>
    this.request<string, ErrorResponse>({
      path: `/conversation/${conversationId}/pin`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name DissolveGroupConversation
   * @request PUT:/conversation/{conversationId}/dissolveGroup
   * @secure
   */
  dissolveGroupConversation = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/dissolveGroup`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name DeleteConversation
   * @request POST:/conversation/{conversationId}/delete-conversation
   * @secure
   */
  deleteConversation = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/delete-conversation`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name AddMembersToConversation
   * @request POST:/conversation/{conversationId}/addMembers
   * @secure
   */
  addMembersToConversation = (conversationId: number, data: number[], params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/addMembers`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name GetRecentConversations
   * @request POST:/conversation/getRecentConversationsByUserId
   * @secure
   */
  getRecentConversations = (
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<ConversationResponse[], ErrorResponse>({
      path: `/conversation/getRecentConversationsByUserId`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name GetGroupConversations
   * @request POST:/conversation/getGroupConversationsByUserId
   * @secure
   */
  getGroupConversations = (
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<ConversationResponse[], ErrorResponse>({
      path: `/conversation/getGroupConversationsByUserId`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name CreateConversation
   * @request POST:/conversation/create
   * @secure
   */
  createConversation = (data: ConversationRequest, params: RequestParams = {}) =>
    this.request<ConversationResponse, ErrorResponse>({
      path: `/conversation/create`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name FindMessage
   * @request GET:/conversation/{conversationId}/find-message
   * @secure
   */
  findMessage = (
    conversationId: number,
    query: {
      message: string
    },
    params: RequestParams = {},
  ) =>
    this.request<MessageFindedResponse[], ErrorResponse>({
      path: `/conversation/${conversationId}/find-message`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name RemoveParticipantFromGroupConversation
   * @request DELETE:/conversation/{conversationId}/removeParticipant
   * @secure
   */
  removeParticipantFromGroupConversation = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
      /** @format int64 */
      participantId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/removeParticipant`,
      method: "DELETE",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags conversation-controller
   * @name LeaveGroupConversation
   * @request DELETE:/conversation/{conversationId}/leave
   * @secure
   */
  leaveGroupConversation = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/conversation/${conversationId}/leave`,
      method: "DELETE",
      query: query,
      secure: true,
      ...params,
    })
}
