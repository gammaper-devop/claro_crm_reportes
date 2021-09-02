export * from './customer.guard';
export * from './sale.guard';

import { CustomerGuard } from './customer.guard';
import { SaleGuard } from './sale.guard';

export const Guards = [CustomerGuard, SaleGuard];
