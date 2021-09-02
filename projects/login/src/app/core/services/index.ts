export * from './api.service';
export * from './login.service';

import { ApiService } from './api.service';
import { LoginService } from './login.service';

export const Services = [ApiService, LoginService];
