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

import { ConversationRequest, ConversationResponse, ErrorResponse } from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class Conversation<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
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
}
