// @ts-check
import { join } from 'path'
import preact from '@preact/preset-vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: {
    factory: 'h',
    fragment: 'Fragment',
  },
  alias: {
    '/@/': join(__dirname, 'src'),
  },

  plugins: [preact()],
}

export default config
