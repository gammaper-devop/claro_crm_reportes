export * from './api.service';
export * from './auth.service';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';

export const Services = [ApiService, AuthService];
