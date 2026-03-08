import { vi } from 'vitest'

(globalThis as { jest: typeof vi }).jest = vi
