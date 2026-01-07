import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  sourcemap: false,
  treeshake: true,
  unused: true,
  unbundle: false,
  platform: 'browser',
  entry: ['./src/index.ts'],
})
