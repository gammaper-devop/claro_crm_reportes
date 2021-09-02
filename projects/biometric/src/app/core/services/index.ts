export * from './api.service';
export * from './biometric.service';
export * from './customer.service';
export * from './search.service';
export * from './profile.service';

import { ApiService } from './api.service';
import { BiometricService } from './biometric.service';
import { CustomerService } from './customer.service';
import { ProfileService } from './profile.service';
import { SearchService } from './search.service';


export const Services = [ApiService, BiometricService, SearchService, CustomerService, ProfileService];
