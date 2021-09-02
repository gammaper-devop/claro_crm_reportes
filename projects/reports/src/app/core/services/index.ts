export * from './api.service';
export * from './customer.service';

import { ApiService } from './api.service';
import { CustomerService } from './customer.service';


export const Services = [ApiService, CustomerService];
