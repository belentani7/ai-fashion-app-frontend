export const colors = {
  abyss: {
    950: '#020610',
    900: '#050d1f',
    800: '#0a1a38',
  },
  azul: {
    950: '#020610',
    900: '#050d1f',
    800: '#0a1a38',
    real: '#14418f',
  },
  cian: {
    DEFAULT: '#33d6ff',
    hi: '#e0faff',
  },
  oro: {
    DEFAULT: '#e8b64c',
    hi: '#ffedbb',
    med: '#c9962e',
  },
  texto: {
    DEFAULT: '#f0f7ff',
    suave: '#a5c3e8',
  },
} as const;

export type ThemeColors = typeof colors;
