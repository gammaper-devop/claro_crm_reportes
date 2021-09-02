import { AuthenticationManager } from '../../../authentication.manager';
import {
  EGrantType,
  IErrorResponseModel,
  IOAuth2Config,
  IPasswordGrantModel,
  IPasswordGrantRequest,
  IPasswordGrantResponse,
  TAuthConfig,
  UTILS,
} from '../../../global';

export class PasswordGrantManager extends AuthenticationManager {
  constructor(authConfig: TAuthConfig) {
    super(authConfig);
  }

  async authenticate(authRequest: IPasswordGrantRequest) {
    try {
      const config = this.config as IOAuth2Config;
      authRequest.grant_type = EGrantType.PASSWORD;
      authRequest.client_id = config.client_id;
      const response = await fetch(config && config.authUrl, {
        method: 'POST',
        body: UTILS.encodeObject(authRequest),
        headers: {
          Authorization:
            'Basic ' + btoa(config.client_id + ':' + config.client_secret),
          'Content-Type': config && String(config.requestType),
          Accept: config && String(config.responseType),
        },
      });
      const passwordGrantResponse = await response.json();
      config.responseModel = config.responseModel as IPasswordGrantModel;
      config.responseErrorModel = config.responseErrorModel as IErrorResponseModel;
      if (
        passwordGrantResponse &&
        passwordGrantResponse[String(config.responseModel.access_token)]
      ) {
        const identity: IPasswordGrantResponse = {
          access_token:
            passwordGrantResponse[String(config.responseModel.access_token)],
          token_type:
            passwordGrantResponse[String(config.responseModel.token_type)],
          expires_in:
            passwordGrantResponse[String(config.responseModel.expires_in)],
          refresh_token:
            passwordGrantResponse[String(config.responseModel.refresh_token)],
        };
        this.validateIdentity(identity);
        this.setIdentity(identity);
        // const responseModelValues = Object.values(config.responseModel);
        const responseModelValues = Object.keys(config.responseModel).map(
          key => config.responseModel && config.responseModel[key],
        );
        for (const key of responseModelValues) {
          delete passwordGrantResponse[key];
        }
      }

      return passwordGrantResponse;
    } catch (error) {
      throw new Error(error);
    }
  }

  private validateIdentity(identity: IPasswordGrantResponse) {
    if (!identity.access_token || typeof identity.access_token !== 'string') {
      throw new Error(`${this.messages.invalid_access_token} ${identity.access_token}.`);
    }
    if (identity.token_type && typeof identity.token_type !== 'string') {
      throw new Error(`${this.messages.invalid_token_type} ${identity.token_type}.`);
    }
    if (identity.refresh_token && typeof identity.refresh_token !== 'string') {
      throw new Error(`${this.messages.invalid_refresh_token} ${identity.refresh_token}.`);
    }
    if (UTILS.isInvalidExpiresTime(identity.expires_in)) {
      throw new Error(`${this.messages.invalid_expires_in} ${identity.expires_in}.`);
    }
  }
}
