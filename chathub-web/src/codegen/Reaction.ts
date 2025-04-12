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

import { ErrorResponse, ReactionRequest } from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class Reaction<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags reaction-controller
   * @name ReactToMessage
   * @request POST:/reaction/react-message
   * @secure
   */
  reactToMessage = (data: ReactionRequest, params: RequestParams = {}) =>
    this.request<void, ErrorResponse>({
      path: `/reaction/react-message`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
}
