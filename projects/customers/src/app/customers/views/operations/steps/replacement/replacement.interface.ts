import { Generics } from '@claro/crm/commons';
import { PortabilityParam } from '@customers/app/core';

export interface ISelectOptions {
  cboServices?: PortabilityParam[];
  cboModOrigins?: Generics[];
  cboRepTypes?: Generics[];
}

export interface ISelectValues {
  cboService?: PortabilityParam;
  cboModOrigin?: PortabilityParam;
  cboRepType?: Generics;
}
