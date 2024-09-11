import type { Config as TailwindConfig } from 'tailwindcss'
import type { Config as DaisyUIConfig } from 'daisyui'
import { dark, light } from './src/styles'

type Config = TailwindConfig & {
  daisyui: DaisyUIConfig
}

const config: Config = {
  theme: {
    extend: {
      borderColor: {
        // faint: 'var(--fallback-bc,oklch(var(--bc)/0.2))',
        faint: '#591278',
      },
      colors: {
        'head-color': '#A5B9F6',
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
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          ...light,
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          ...dark,
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

export default config
