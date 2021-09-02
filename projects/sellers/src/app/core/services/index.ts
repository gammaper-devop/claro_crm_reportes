export * from './api.service';
export * from './sellers.service';

import { ApiService } from './api.service';
import { SellersService } from './sellers.service';

export const Services = [
    ApiService,
    SellersService
];
