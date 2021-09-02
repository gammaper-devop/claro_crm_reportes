/*
import { EAuthorizationType, EGrantType, IAuthConfig, IOAuth2Config } from './';

const oAuth2Config: IOAuth2Config = {
  grantType: EGrantType.PASSWORD,
  authUrl: 'http://localhost:3000/oauth/token',
  secretKey: String(Math.log(1000)),
  client_id: 'application',
  client_secret: 'secret',
  responseModel: {
    access_token: 'accessToken',
    expires_in: 'accessTokenExpiresAt',
    refresh_token: 'refreshToken',
    // this.rules['typeToken'] = this.rules.hasOwnProperty('typeToken') ? this.rules.typeToken : 'Bearer';
    // this.rules['headerName'] = this.rules.hasOwnProperty('headerName') ? this.rules.headerName : 'Authorization';
  },
  i18nLang:'en_US',
}

const authConfig: IAuthConfig = {
  authType: EAuthorizationType.OAUTH2,
  config: oAuth2Config,
};

import { AuthenticationFactory } from './';
const provider = new AuthenticationFactory(authConfig);

const response = provider.authInstance.authenticate({
  username: 'frontend',
  password: 'password',
});
response.then((response: any) => {
  console.log(response);
});
*/
