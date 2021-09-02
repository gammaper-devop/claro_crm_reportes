import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthenticationFactory, IAuthConfig } from '@claro/core';

export {
  EAuthorizationType,
  EGrantType,
  IAuthConfig,
  IAzureConfig,
  IOAuth2Config,
  TAuthConfig
} from '@claro/core';

import { Authentication } from './authentication';
export { Authentication } from './authentication';

import { TokenInterceptor } from './token.interceptor';

const AuthConfig = new InjectionToken<IAuthConfig>('authConfig');

export function factoryFnAuth(authConfig: IAuthConfig) {
  const provider = new AuthenticationFactory(authConfig);
  return provider.authInstance;
}

@NgModule()
export class AuthModule {
  static forRoot(authConfig: IAuthConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        {
          provide: AuthConfig,
          useValue: authConfig
        },
        {
          provide: Authentication,
          useFactory: factoryFnAuth,
          deps: [AuthConfig]
        }
      ]
    };
  }
}
