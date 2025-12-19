import * as migration_20251107_183848_initial from './20251107_183848_initial';
import * as migration_20251214_160005_header_label_migration from './20251214_160005_header_label_migration';

export const migrations = [
  {
    up: migration_20251107_183848_initial.up,
    down: migration_20251107_183848_initial.down,
    name: '20251107_183848_initial',
  },
  {
    up: migration_20251214_160005_header_label_migration.up,
    down: migration_20251214_160005_header_label_migration.down,
    name: '20251214_160005_header_label_migration'
  },
];
