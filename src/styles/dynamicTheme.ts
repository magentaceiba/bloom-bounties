import { css } from '@emotion/react'
import { borderColor, border } from '.'
import { dark, light } from '.'

export const getDynamicTheme = (isLight: boolean) => {
  const staticCssOVerrides = `
    .connect-button,
    .dynamic-widget-inline-controls,
    .dynamic-widget-inline-controls__account-control,
    .dynamic-widget-inline-controls__account-control-container,
    .dynamic-widget-inline-controls__network-picker {
      max-height: 2rem;
      border-radius: 1rem;
    }
    .evm-network-control__container--error {
      border-radius: 1rem;
    }
    .popper-content {
      z-index: 3;
    }
      `

  const borderColor = isLight ? light.neutral : dark['base-content']
  const textColor = isLight ? 'black' : 'white'
  const dynamicBrandColor = isLight ? light.accent : dark.accent
  const base1 = isLight ? light['base-100'] : dark['base-100']
  const base2 = isLight ? light['base-200'] : dark['base-200']
  const base3 = isLight ? light['base-300'] : dark['base-300']
  const buttonColor = isLight ? light['base-100'] : dark['base-100']

  const shadowDomOverWrites = css`
    .dynamic-shadow-dom {
      --dynamic-font-family-primary: 'Open Sans', sans-serif;

      --dynamic-base-1: ${base1};
      --dynamic-base-2: ${base2};
      --dynamic-base-3: ${base3};
      --dynamic-base-4: ${borderColor};

      --dynamic-text-primary: ${textColor};
      --dynamic-text-secondary: ${borderColor};
      --dynamic-text-tertiary: ${borderColor};

      --dynamic-brand-primary-color: ${dynamicBrandColor};
      --dynamic-badge-dot-background: ${dynamicBrandColor};
      --dynamic-footer-background-color: ${dynamicBrandColor};

      --dynamic-search-bar-background: ${base2};
      --dynamic-search-bar-background-focus: ${base1};
      --dynamic-search-bar-background-hover: ${base3};
      --dynamic-search-bar-border: 0.0625rem solid ${base2};
      --dynamic-search-bar-border-hover: 0.0625rem solid ${borderColor};
      --dynamic-search-bar-border-focus: 0.0625rem solid ${borderColor};

      --dynamic-badge-color: ${textColor};
      --dynamic-badge-background: ${base2};

      --dynamic-button-primary-background: ${buttonColor};
      --dynamic-button-primary-border: 0.0625rem solid ${borderColor};

      --dynamic-wallet-list-tile-background: ${base2};
      --dynamic-wallet-list-tile-background-hover: ${base1};
    }
  `
  const cssOverrides =
    `
  .connect-button,
  .dynamic-widget-inline-controls {
    background: ${buttonColor};
    border: 1px solid ${borderColor}
  }
  ` + staticCssOVerrides

  return {
    shadowDomOverWrites,
    cssOverrides,
  }
}

const base1 = 'var(--fallback-b1,oklch(var(--b1)))'
const base2 = 'var(--fallback-b2,oklch(var(--b2)))'
const base3 = 'var(--fallback-b3,oklch(var(--b3)))'
const baseContent = 'var(--fallback-bc,oklch(var(--bc)))'

const faintBaseContent = 'var(--fallback-bc,oklch(var(--bc)/0.7))'
const brandColor = 'var(--fallback-p,oklch(var(--p)))'
const buttonColor = base2

const borderRadius = 'var(--rounded-box, 1rem);'

const shadowDomOverWrites = css`
  .dynamic-shadow-dom {
    --dynamic-font-family-primary: 'Archivo';

    --dynamic-base-1: ${base1};
    --dynamic-base-2: ${base2};
    --dynamic-base-3: ${base3};
    --dynamic-base-4: ${borderColor};

    --dynamic-text-primary: ${baseContent};
    --dynamic-text-secondary: ${faintBaseContent};
    --dynamic-text-tertiary: ${faintBaseContent};

    --dynamic-brand-primary-color: ${brandColor};
    --dynamic-badge-dot-background: ${brandColor};
    --dynamic-footer-background-color: ${brandColor};

    --dynamic-search-bar-background: ${base2};
    --dynamic-search-bar-background-focus: ${base3};
    --dynamic-search-bar-background-hover: ${base3};
    --dynamic-search-bar-border: ${border};
    --dynamic-search-bar-border-hover: ${border};
    --dynamic-search-bar-border-focus: ${border};
    --dynamic-search-border-radius: ${borderRadius};

    --dynamic-badge-color: ${baseContent};
    --dynamic-badge-background: ${base2};

    --dynamic-button-primary-background: ${buttonColor};
    --dynamic-button-primary-border: ${border};

    --dynamic-wallet-list-tile-background: ${base2};
    --dynamic-wallet-list-tile-background-hover: ${base1};
    --dynamic-wallet-list-tile-border-radius: ${borderRadius};

    --dynamic-modal-border: ${border};
    --dynamic-hover: ${buttonColor};
    --dynamic-border-radius: ${borderRadius};
  }
`

const cssOverrides = `
  .connect-button,
  .dynamic-widget-inline-controls,
  .dynamic-widget-inline-controls__account-control,
  .dynamic-widget-inline-controls__account-control-container,
  .dynamic-widget-inline-controls__network-picker {
    max-height: 2rem;
    border-radius: 1rem;
  }

  .evm-network-control__container--error {
    border-radius: 1rem;
  }

  .popper-content {
    z-index: 3;
  }

  .dynamic-widget-card,
  .modal-card {
    border: ${border};
  }

  .dynamic-widget-inline-controls {
    background: ${buttonColor};
  }

  .single-wallet-buttons__copied {
    color: ${baseContent};
  }
`

export const dynamicTheme = {
  shadowDomOverWrites,
  cssOverrides,
}
