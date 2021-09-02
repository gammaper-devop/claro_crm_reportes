export enum EGrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  IMPLICIT = 'implicit',
  PASSWORD = 'password',
}

export enum EAuthorizationType {
  OAUTH2 = 'oauth2',
  AZURE = 'azure',
  AWS = 'awsCognito',
  ALTEMISTA = 'altemista',
}

export enum EAuthorizationProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
}

export enum EErrorResponseType {
  INVALID_REQUEST = 'invalid_request',
  INVALID_GRANT = 'invalid_grant',
  UNAUTHORIZED_CLIENT = 'unauthorized_client',
  UNSUPPORTED_GRANT_TYPE = 'unsupported_grant_type',
  INVALID_SCOPE = 'invalid_scope',
}

export enum EStorageType {
  LOCAL = 'local',
  SESSION = 'session',
  MEMORY = 'memory',
}

export enum ERequestType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
}

export enum EResponseType {
  JSON = 'application/json',
  XML = 'application/xml',
  TEXT = 'text/plain',
}
