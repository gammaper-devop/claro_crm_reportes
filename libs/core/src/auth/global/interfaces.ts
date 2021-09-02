import {
  EAuthorizationType,
  EErrorResponseType,
  EGrantType,
  ERequestType,
  EResponseType,
  EStorageType,
} from './enums';

export type TAuthConfig = IAzureConfig | IOAuth2Config;

export type TAuthRequest = IPasswordGrantRequest;

export type TAuthResponseModel = IPasswordGrantModel;

export type TAuthErrorResponseModel = IErrorResponseModel;

export type TAuthResponse = IPasswordGrantResponse;

export interface IAuthentication {
  authenticate(authRequest: TAuthRequest): Promise<any>;
  getToken(): string;
  isAuthenticated(): boolean;
  isExpired(): boolean;
  clean(): void;
}

export interface IAuthConfig {
  authType: EAuthorizationType;
  config: TAuthConfig;
}

export interface IAuthBaseConfig {
  secretKey: string;
  headerName?: string;
  tokenType?: string;
  responseModel?: TAuthResponseModel;
  responseErrorModel?: TAuthErrorResponseModel;
  storageType?: EStorageType;
  i18nLang?: string;
  interceptor?: boolean;
}

export interface IAzureConfig extends IAuthBaseConfig {
  tenant_id: string;
}

export interface IOAuth2Config extends IAuthBaseConfig {
  grantType: EGrantType;
  authUrl: string;
  client_id?: string;
  client_secret?: string;
  requestType?: ERequestType;
  responseType?: EResponseType;
}

export interface IPasswordGrantModel {
  access_token?: string;
  token_type?: string;
  expires_in?: string;
  refresh_token?: string;
  [key: string]: any;
}

export interface IBaseRequest {
  grant_type?: string;
}

export interface IPasswordGrantRequest extends IBaseRequest {
  username: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface IPasswordGrantResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  [key: string]: any;
}

export interface IErrorResponse {
  error: EErrorResponseType;
  error_description?: string;
  error_uri?: string;
}

export interface IErrorResponseModel {
  error?: string;
  error_description?: string;
  error_uri?: string;
}

export interface IMessages {
  secret_key_not_found: string;
  invalid_access_token: string;
  invalid_refresh_token: string;
  invalid_token_type: string;
  invalid_expires_in: string;
}
