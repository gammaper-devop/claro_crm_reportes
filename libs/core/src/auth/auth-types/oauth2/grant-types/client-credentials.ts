import { AuthenticationManager } from '../../../authentication.manager';
import { TAuthConfig } from '../../../global';

export class ClientCredentialsGrantManager extends AuthenticationManager {
  constructor(authConfig: TAuthConfig) {
    super(authConfig);
  }
}
