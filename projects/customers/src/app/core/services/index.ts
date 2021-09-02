export * from './api.service';
export * from './customer.service';
export * from './operations.service';
export * from './payments.service';
export * from './portability.service';
export * from './claro-points.service';
export * from './profile.service';
export * from './search.service';
export * from './sale.service';
export * from './login.service';
export * from './replacement.service';
export * from './reasons.service';
export * from './delivery.service';
export * from './dipatch-options.service';
export * from './multipoints.service';

import { ApiService } from './api.service';
import { CustomerService } from './customer.service';
import { OperationsService } from './operations.service';
import { PaymentsService } from './payments.service';
import { PortabilityService } from './portability.service';
import { ClaroPointsService } from './claro-points.service';
import { ProfileService } from './profile.service';
import { SearchService } from './search.service';
import { SaleService } from './sale.service';
import { LoginService } from './login.service';
import { ReplacementService } from './replacement.service';
import { MultipointsService } from './multipoints.service';
import { ReasonsService } from './reasons.service';
import { DeliveryService } from './delivery.service';
import { DispatchOptionsService } from './dipatch-options.service';

export const Services = [
  ApiService,
  CustomerService,
  OperationsService,
  PaymentsService,
  PortabilityService,
  ClaroPointsService,
  ProfileService,
  SearchService,
  SaleService,
  LoginService,
  ReplacementService,
  MultipointsService,
  ReasonsService,
  DeliveryService,
  DispatchOptionsService
];
