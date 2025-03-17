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
  BlockRequest,
  ChangePasswordRequest,
  ChangeProfileRequest,
  ErrorResponse,
  SuccessResponse,
  UserDTO,
} from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class User<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags user-controller
   * @name UpdateProfile
   * @request PUT:/user/update-profile
   * @secure
   */
  updateProfile = (data: ChangeProfileRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/user/update-profile`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name ChangePassword
   * @request POST:/user/change-password
   * @secure
   */
  changePassword = (data: ChangePasswordRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/user/change-password`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name BlockUser
   * @request POST:/user/block-user
   * @secure
   */
  blockUser = (data: BlockRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/user/block-user`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name Search
   * @request GET:/user/searchUserByNameOrPhone
   * @secure
   */
  search = (
    query: {
      /** @format int64 */
      userId: number
      query: string
    },
    params: RequestParams = {},
  ) =>
    this.request<UserDTO[], ErrorResponse>({
      path: `/user/searchUserByNameOrPhone`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name FindUserByPhoneNumber
   * @request GET:/user/findUserByPhoneNumber
   * @secure
   */
  findUserByPhoneNumber = (
    query: {
      phoneNumber: string
    },
    params: RequestParams = {},
  ) =>
    this.request<UserDTO, ErrorResponse>({
      path: `/user/findUserByPhoneNumber`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name FindUserByUserId
   * @request GET:/user/findUserById/{userId}
   * @secure
   */
  findUserByUserId = (userId: number, params: RequestParams = {}) =>
    this.request<UserDTO, ErrorResponse>({
      path: `/user/findUserById/${userId}`,
      method: "GET",
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags user-controller
   * @name UnblockUser
   * @request DELETE:/user/unblock-user
   * @secure
   */
  unblockUser = (data: BlockRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/user/unblock-user`,
      method: "DELETE",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
}
