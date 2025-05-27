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

import { ErrorResponse, SuccessResponse } from "./data-contracts"
import { HttpClient, RequestParams } from "./http-client"

export class Call<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags call-controller
   * @name GetStringeeToken
   * @request GET:/call/stringee-token
   * @secure
   */
  getStringeeToken = (
    query?: {
      userId?: string
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/call/stringee-token`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
}
