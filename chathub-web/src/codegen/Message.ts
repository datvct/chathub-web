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

import { ErrorResponse, MessageResponse } from "./data-contracts"
import { HttpClient, RequestParams } from "./http-client"

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
   * @name GetMessages
   * @request GET:/message/{conversationId}
   * @secure
   */
  getMessages = (conversationId: number, params: RequestParams = {}) =>
    this.request<MessageResponse[], ErrorResponse>({
      path: `/message/${conversationId}`,
      method: "GET",
      secure: true,
      ...params,
    })
}
