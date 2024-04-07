import type { Config } from 'tailwindcss'
import type { Config as DaisyUIConfig } from 'daisyui'
import { dark, light } from './src/styles'

interface IConfig extends Config {
  daisyui: DaisyUIConfig
}

const config: IConfig = {
  theme: {
    extend: {
      borderColor: {
        faint: 'var(--fallback-bc,oklch(var(--bc)/0.2))',
      },
    },
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  daisyui: {
    themes: [
      {
        dark,
        light,
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

export default config
