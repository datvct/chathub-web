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

import { ErrorResponse, MessageResponse } from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class Message<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags message-controller
   * @name UnsendMessage
   * @request PUT:/message/unsent
   * @secure
   */
  unsendMessage = (
    query: {
      /** @format int64 */
      userId: number
      /** @format int64 */
      messageId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<string, ErrorResponse>({
      path: `/message/unsent`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags message-controller
   * @name DeleteMessage
   * @request PUT:/message/delete
   * @secure
   */
  deleteMessage = (
    query: {
      /** @format int64 */
      userId: number
      /** @format int64 */
      messageId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<string, ErrorResponse>({
      path: `/message/delete`,
      method: "PUT",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags message-controller
   * @name ForwardMessage
   * @request POST:/message/forward
   * @secure
   */
  forwardMessage = (
    query: {
      /** @format int64 */
      senderId: number
      /** @format int64 */
      originalMessageId: number
      conversationIds: number[]
    },
    data: string,
    params: RequestParams = {},
  ) =>
    this.request<MessageResponse[], ErrorResponse>({
      path: `/message/forward`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags message-controller
   * @name GetMessages
   * @request GET:/message/{conversationId}
   * @secure
   */
  getMessages = (
    conversationId: number,
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<MessageResponse[], ErrorResponse>({
      path: `/message/${conversationId}`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
}
