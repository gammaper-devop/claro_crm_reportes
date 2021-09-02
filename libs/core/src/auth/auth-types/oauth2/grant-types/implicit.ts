import { AuthenticationManager } from '../../../authentication.manager';
import { TAuthConfig } from '../../../global';

export class ImplicitGrantManager extends AuthenticationManager {
  constructor(authConfig: TAuthConfig) {
    super(authConfig);
  }
}
