export * from './api.service';
export * from './reports.service';
//export * from './customer.service';


import { ApiService } from './api.service';
import { CRMReportsService } from './reports.service';


export const Services = [ApiService, CRMReportsService];
