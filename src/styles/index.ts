const base = {
  primary: '#A5B9F6', // Vibrant purple
  'primary-focus': '#832083', // Darker vibrant purple
  'primary-content': '#000000', // White text on primary

  secondary: '#703070', // Muted purple
  'secondary-focus': '#562256', // Darker muted purple
  'secondary-content': '#000000', // White text on secondary

  accent: '#ff7f50', // Coral accent
  'accent-focus': '#e65e2d', // Darker coral accent
  'accent-content': '#000000', // White text on accent

  neutral: '#4d316c', // Neutral purple (base 3 from your theme)
  'neutral-focus': '#3c245a', // Darker neutral purple (base 2)
  'neutral-content': '#A5B9F6', // Light text on neutral

  info: '#5FA7FB',
  success: '#53DD6C',
  warning: '#FFDB5A',
  error: '#D30C54',

  '--rounded-box': '0.5rem',
  '--rounded-btn': '.25rem',
  '--rounded-badge': '0.8rem',

  '--animation-btn': '.25s',
  '--animation-input': '.2s',

  '--btn-text-case': 'uppercase',
  '--navbar-padding': '.5rem',
  '--border-btn': '1px',
}

const lightBase = {
  'base-100': '#1a171b',
  'base-200': '#1a171b',
  'base-300': '#0d0c0d',
  'base-content': '#F7F7FF',
  ...base,
}

const darkBase = {
  'base-100': '#1B0D2A', // Dark purple (base 1)
  'base-200': '#261942', // Darker purple (base 2)
  'base-300': '#4d316c', // Even darker purple (base 3)
  'base-content': '#e0d7f3', // Light text color
  ...base,
}

export const borderColor = 'var(--fallback-bc,oklch(var(--bc)/0.2))'
export const borderStyle = '0.0625rem solid'
export const border = `${borderStyle} ${borderColor}`

export const initialTheme = 'dark' as 'light' | 'dark'

const extend = (base: typeof darkBase | typeof lightBase) => ({
  ...base,
  ...({
    '.collapse:not(.collapse-close) > :where(input[name="accordion"][type="radio"]:checked ~ .collapse-content)':
      {
        'border-top': border,
        'padding-top': '1rem',
        'padding-bottom': '1rem',
      },
    '.badge': {
      border,
    },
    '.card': {
      'background-color': base['base-200'],
      border,
    },
    '.input': {
      'background-color': base['base-200'],
    },
    '.skeleton': {
      border,
    },
    '.btn': {
      '&:not(.btn-link, .btn-outline, .btn-ghost)': {
        border,
      },
    },
    '.collapse': {
      border,
    },
    '.menu': {
      gap: '0.5rem',
      border,
    },
    '.modal-box': {
      border,
    },
    '.btn-active': {
      'background-color': base['base-content'],
      color: base['base-100'],
    },
    '.alert': {
      border,
    },
    '.tabs': {
      border,
    },
    '.table': {
      ':where(thead tr, tbody tr:not(:last-child), tbody tr:first-child:last-child)':
        {
          'border-bottom': border,
        },
    },
  } as unknown as Record<string, string>),
})

export const light = extend(lightBase)
export const dark = extend(darkBase)
