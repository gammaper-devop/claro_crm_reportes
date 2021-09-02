import { Generics } from '@claro/crm/commons';
import { PortabilityParam } from '@customers/app/core';

export interface ISelectOptions {
  cboServices?: PortabilityParam[];
  cboOperators?: PortabilityParam[];
  cboModOrigins?: Generics[];
}

export interface ISelectValues {
  cboService?: PortabilityParam;
  cboOperator?: PortabilityParam;
  cboModOrigin?: PortabilityParam;
}
