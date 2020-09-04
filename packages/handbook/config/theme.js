/** 
 * This file is proprietary to Synchronous Health brand;
 * Please change the colors and fonts upon forking
 * unless you are developing a Synchronous Health branded site
 */

const colors = [
  /* SHPurple */ '#8B3765',
  /* SHNavyBlue */ '#26294A',
  /* SHGreen */ '#6B8C56',
  /* SHBeige */ '#E2E7DD',
  /* SHBlue */ '#33375E',

  /* SHBeigeAccent */ "#E5DFCF",
  /* SHMediumGray  */ "#666983",
  /* SHDarkGray */ "#26284B",
  /* SHOffWhite */ "#F8F6F3"
]

export const theme = {
  colors: {
    primary: colors[0],
    primaryLight: shadeColor(colors[0], .20) + "80",
    primaryDark: shadeColor(colors[0], -.20),
    primaryBackground: shadeColor(colors[1], 0.8),
    secondary: colors[1],
    secondaryLight: shadeColor(colors[1], .20) + "80",
    secondaryDark: shadeColor(colors[1], -.20),
    secondaryBackground: shadeColor(colors[1], 0.8),
    tertiary: colors[2],
    tertiaryLight: shadeColor(colors[2], .20) + "80",
    tertiaryDark: shadeColor(colors[2], -.20),
    tertiaryBackground: shadeColor(colors[2], 0.8),
    neutral: colors[3],
    neutralLight: shadeColor(colors[3], .20) + "80",
    neutralDark: shadeColor(colors[3], -.20),
    neutralBackground: shadeColor(colors[3], 0.8),
    complement: colors[3],
    complementLight: shadeColor(colors[4], .20) + "80",
    complementDark: shadeColor(colors[4], -.20),
    complementBackground: shadeColor(colors[4], 0.8),
    text: '#333',
    textOnColor: '#000',
    textOnPrimary: '#ffffff',
    textOnSecondary: '#ffffff',
    textOnPrimaryLight: '#333'
  },
  breakpoints: ['32em', '48em', '64em'],
  space: [0, 4.5, 9, 15, 36, 72, 144],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72, 96],
  fontWeights: {
    thin: 400,
    normal: 400,
    header: 700,
    bold: 700
  },
  radii: [0, 2, 4],
  googleFonts: ['Karla', "Source Serif Pro", "IBM Plex Mono"],
  fonts: {
    0: '"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    header: '"Source Serif Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    sans: '"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    serif: '"Source Serif Pro", "Times New Roman", Georgia, Serif',
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
    physics: { slow: { type: 'physics', velocity: 200 }, fast: { type: 'physics', velocity: 2000 } }
  }
}

function shadeColor(color, percent) {
  var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}