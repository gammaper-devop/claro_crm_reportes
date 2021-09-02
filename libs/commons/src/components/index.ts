export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './material.module';

import { AtomsComponents } from './atoms';
import { MoleculesComponents } from './molecules';
import { OrganismsComponents } from './organisms';

export const Components = [
  ...AtomsComponents,
  ...MoleculesComponents,
  ...OrganismsComponents
];

import { ProgressbarComponent } from './atoms/progressbar/progressbar.component';

export const EntryComponents = [ProgressbarComponent];
