export * from './api.service';
export * from './contracts.service';

import { ApiService } from './api.service';
import { ContractsService } from './contracts.service';

export const Services = [ApiService, ContractsService];
