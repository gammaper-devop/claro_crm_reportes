export * from './atoms';
export * from './molecules';
export * from './organisms';

import { AtomsComponents } from './atoms';
import { MoleculesComponents } from './molecules';
import { OrganismsComponents } from './organisms';

export const Components = [
  ...AtomsComponents,
  ...MoleculesComponents,
  ...OrganismsComponents
];
