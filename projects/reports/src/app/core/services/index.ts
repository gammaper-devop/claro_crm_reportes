export * from './api.service';
export * from './reports.service';
export * from "./export-excel.service";


import { ApiService } from './api.service';
import { CRMReportsService } from './reports.service';
import { ExportExcelService } from "./export-excel.service";

export const Services = [ApiService, CRMReportsService, ExportExcelService];
