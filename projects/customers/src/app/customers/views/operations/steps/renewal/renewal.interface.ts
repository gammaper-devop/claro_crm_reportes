import { Generics } from '@claro/crm/commons';
import { PortabilityParam } from '@customers/app/core';

export interface ISelectOptions {
  cboServices?: PortabilityParam[];
  cboModOrigins?: Generics[];
  cboRenTypes?: Generics[];
}

export interface ISelectValues {
  cboService?: PortabilityParam;
  cboModOrigin?: PortabilityParam;
  cboRenType?: Generics;
}
