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

import { ErrorResponse } from "./data-contracts"
import { HttpClient, RequestParams } from "./http-client"

export class Aws<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags aws-s-3-controller
   * @name GetPreSignedUrl
   * @request GET:/aws/s3/presigned-url
   * @secure
   */
  getPreSignedUrl = (
    query: {
      fileName: string
      contentType: string
    },
    params: RequestParams = {},
  ) =>
    this.request<Record<string, string>, ErrorResponse>({
      path: `/aws/s3/presigned-url`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
}
