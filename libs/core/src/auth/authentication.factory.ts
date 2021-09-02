import {
  AuthorizationCodeGrantManager,
  ClientCredentialsGrantManager,
  ImplicitGrantManager,
  PasswordGrantManager,
} from './auth-types';

import {
  CONSTANTS,
  EAuthorizationType,
  ERequestType,
  EResponseType,
  EStorageType,
  IAuthConfig,
  IAzureConfig,
  IOAuth2Config,
  TAuthConfig,
} from './global';

export class AuthenticationFactory {
  authInstance = {} as
    | AuthorizationCodeGrantManager
    | ClientCredentialsGrantManager
    | ImplicitGrantManager
    | PasswordGrantManager;
  private config = {} as TAuthConfig;

  constructor(authConfig: IAuthConfig) {
    authConfig.config.headerName = authConfig.config.headerName || CONSTANTS.headerName;
    authConfig.config.tokenType = authConfig.config.tokenType || CONSTANTS.tokenType;
    authConfig.config.responseModel = authConfig.config.responseModel || CONSTANTS.responseModel;
    authConfig.config.responseErrorModel = authConfig.config.responseErrorModel || CONSTANTS.errorResponseModel;
    authConfig.config.i18nLang = authConfig.config.i18nLang || CONSTANTS.i18nLang;
    authConfig.config.interceptor = authConfig.config.interceptor || CONSTANTS.interceptor;

    this.config = authConfig.config;
    switch (authConfig.authType) {
      case EAuthorizationType.AZURE:
        this.configureAzure();
        break;
      case EAuthorizationType.OAUTH2:
        this.configureOAuth2();
        break;
    }
  }

  private configureAzure() {
    const authConfig = this.config as IAzureConfig;
    authConfig.tenant_id = '';
  }

  private configureOAuth2() {
    const authConfig = this.config as IOAuth2Config;
    authConfig.requestType = authConfig.requestType || ERequestType.FORM;
    authConfig.responseType = authConfig.responseType || EResponseType.JSON;
    authConfig.storageType = authConfig.storageType || EStorageType.LOCAL;
    const grantTypes = {
      authorization_code: () => new AuthorizationCodeGrantManager(authConfig),
      client_credentials: () => new ClientCredentialsGrantManager(authConfig),
      implicit: () => new ImplicitGrantManager(authConfig),
      password: () => new PasswordGrantManager(authConfig),
    };
    if (grantTypes.hasOwnProperty(authConfig.grantType)) {
      this.authInstance = grantTypes[authConfig.grantType]();
    }
  }
}
