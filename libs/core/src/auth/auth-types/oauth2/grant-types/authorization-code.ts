import { AuthenticationManager } from '../../../authentication.manager';
import { TAuthConfig } from '../../../global';

export class AuthorizationCodeGrantManager extends AuthenticationManager {
  constructor(authConfig: TAuthConfig) {
    super(authConfig);
  }
}
