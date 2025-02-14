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

export class Messages<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags message-controller
   * @name GetMessages
   * @request GET:/messages/{conversationId}
   * @secure
   */
  getMessages = (conversationId: number, params: RequestParams = {}) =>
    this.request<MessageResponse[], ErrorResponse>({
      path: `/messages/${conversationId}`,
      method: "GET",
      secure: true,
      ...params,
    })
}
