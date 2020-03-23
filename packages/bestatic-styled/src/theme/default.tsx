/* eslint-disable no-bitwise */
function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  const R = f >> 16
  const G = (f >> 8) & 0x00ff
  const B = f & 0x0000ff
  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`
}

const colors = ['#FF974F', '#F54F29', '#FFD393', '#9C9B7A', '#405952']

export const theme = {
  colors: {
    primary: colors[0],
    primaryLight: `${shadeColor(colors[0], 0.2)}40`,
    primaryDark: shadeColor(colors[0], -0.2),
    primaryBackground: shadeColor(colors[1], 0.8),
    secondary: colors[1],
    secondaryLight: `${shadeColor(colors[1], 0.2)}40`,
    secondaryDark: shadeColor(colors[1], -0.2),
    secondaryBackground: shadeColor(colors[1], 0.8),
    tertiary: colors[2],
    tertiaryLight: `${shadeColor(colors[2], 0.2)}40`,
    tertiaryDark: shadeColor(colors[2], -0.2),
    tertiaryBackground: shadeColor(colors[2], 0.8),
    neutral: colors[3],
    neutralLight: `${shadeColor(colors[3], 0.2)}40`,
    neutralDark: shadeColor(colors[3], -0.2),
    neutralBackground: shadeColor(colors[3], 0.8),
    complement: colors[3],
    complementLight: `${shadeColor(colors[4], 0.2)}40`,
    complementDark: shadeColor(colors[4], -0.2),
    complementBackground: shadeColor(colors[4], 0.8),
    text: '#333',
    textOnPrimary: '#ffffff',
    textOnSecondary: '#ffffff',
    textOnPrimaryLight: '#333',
    textOnColor: '#fff'
  },
  breakpoints: ['32em', '48em', '64em'],
  space: [0, 4.5, 9, 15, 36, 72, 144],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72, 96],
  fontWeights: {
    thin: 100,
    normal: 300,
    header: 500,
    bold: 700
  },
  radii: [0, 2, 4],
  googleFonts: ['Barlow', 'IBM Plex Serif', 'IBM Plex Mono'],
  fonts: {
    0: '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    header:
      '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    body:
      '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    sans:
      '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    serif: '"IBM Plex Serif", "Times New Roman", Georgia, Serif',
    mono: '"IBM Plex Mono","SF Mono", "Roboto Mono", Menlo, monospace'
  },
  shadows: [
    'none',
    '0px 2px 3px #ede9df',
    'inset 0 0 0 1px #eee',
    'inset 0 0 0 1px #eee, 0 0 4px #eee'
  ],
  transitions: {
    springs: { medium: { type: 'spring', stiffness: 500, duration: 100 } },
    physics: {
      slow: { type: 'physics', velocity: 200 },
      fast: { type: 'physics', velocity: 2000 }
    }
  }
}
