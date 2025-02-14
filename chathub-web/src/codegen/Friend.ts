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

import { ErrorResponse, FriendRequest, FriendshipRequest, SuccessResponse, UserDTO } from "./data-contracts"
import { ContentType, HttpClient, RequestParams } from "./http-client"

export class Friend<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags friend-controller
   * @name SendFriendRequest
   * @request POST:/friend/send-request
   * @secure
   */
  sendFriendRequest = (data: FriendshipRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/friend/send-request`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name RejectFriendRequest
   * @request POST:/friend/reject-request
   * @secure
   */
  rejectFriendRequest = (data: FriendshipRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/friend/reject-request`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name AcceptFriendRequest
   * @request POST:/friend/accept-request
   * @secure
   */
  acceptFriendRequest = (data: FriendshipRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/friend/accept-request`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name GetListFriend
   * @request GET:/friend/list-friend
   * @secure
   */
  getListFriend = (
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<UserDTO[], ErrorResponse>({
      path: `/friend/list-friend`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name GetListFriendRequest
   * @request GET:/friend/list-friend-request
   * @secure
   */
  getListFriendRequest = (
    query: {
      /** @format int64 */
      userId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<FriendRequest[], ErrorResponse>({
      path: `/friend/list-friend-request`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name UnsentFriendRequest
   * @request DELETE:/friend/unsent-request
   * @secure
   */
  unsentFriendRequest = (
    query: {
      /** @format int64 */
      userId: number
      /** @format int64 */
      friendId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/friend/unsent-request`,
      method: "DELETE",
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags friend-controller
   * @name DeleteFriend
   * @request DELETE:/friend/unfriend
   * @secure
   */
  deleteFriend = (
    query: {
      /** @format int64 */
      userId: number
      /** @format int64 */
      friendId: number
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/friend/unfriend`,
      method: "DELETE",
      query: query,
      secure: true,
      ...params,
    })
}
