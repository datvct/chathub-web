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

import {
  AuthRequest,
  AuthResponse,
  ErrorResponse,
  RegistrationRequest,
  SuccessResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags auth-controller
   * @name Register
   * @request POST:/auth/register
   * @secure
   */
  register = (data: RegistrationRequest, params: RequestParams = {}) =>
    this.request<SuccessResponse, ErrorResponse>({
      path: `/auth/register`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth-controller
   * @name Login
   * @request POST:/auth/login
   * @secure
   */
  login = (data: AuthRequest, params: RequestParams = {}) =>
    this.request<AuthResponse, ErrorResponse>({
      path: `/auth/login`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
