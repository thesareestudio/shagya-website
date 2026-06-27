import * as migration_20260627_104423_initial from './20260627_104423_initial'

export const migrations = [
  {
    up: migration_20260627_104423_initial.up,
    down: migration_20260627_104423_initial.down,
    name: '20260627_104423_initial',
  },
]
