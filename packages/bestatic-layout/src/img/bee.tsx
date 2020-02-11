import * as React from 'react'
import { renderToStaticMarkup } from '@bestatic/core'

export const BeStyledLogo: React.SFC<{
  size: number
  color?: string
  theme: { colors: { textOnPrimary: string } }
}> = ({ size, theme, color }) => {
  color =
    color || (theme && theme.colors && theme.colors.textOnPrimary) || '#FFF'

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width={size}
      height={size}
      viewBox="0, 0, 89.167, 87.553"
    >
      <g id="Layer_1">
        <g>
          <path
            d="M66.185,12.099 L66.818,3.702 C66.956,1.801 65.528,0.148 63.627,0.009 C61.726,-0.129 60.072,1.3 59.934,3.2 L59.512,12.558 C61.678,11.858 63.973,11.709 66.185,12.099 z"
            fill={color}
          />
          <path
            d="M77.567,25.271 C77.632,27.516 77.152,29.766 76.145,31.807 L85.465,32.746 C87.366,32.885 89.019,31.456 89.158,29.555 C89.296,27.654 87.867,26.001 85.966,25.862 L77.567,25.271 z"
            fill={color}
          />
          <path
            d="M7.502,69.749 L1.195,75.2 C-0.247,76.446 -0.406,78.626 0.84,80.068 C2.086,81.51 4.266,81.669 5.708,80.423 L12.016,74.972 C11.131,74.255 10.293,73.456 9.523,72.565 C8.753,71.673 8.083,70.729 7.502,69.749 z"
            fill={color}
          />
          <path
            d="M50.784,36.911 C49.857,37.549 48.857,38.151 47.773,38.703 C44.549,40.348 40.818,41.493 36.811,42.107 C37.578,43.594 38.557,45.066 39.75,46.446 C40.942,47.826 42.256,49.01 43.617,49.982 C44.805,46.107 46.479,42.581 48.574,39.63 C49.278,38.638 50.018,37.735 50.784,36.911 z"
            fill={color}
          />
          <path
            d="M75.77,62.87 C76.46,53.402 73.99,44.706 69.852,39.917 C67.894,37.651 65.564,36.26 63.017,36.074 C55.087,35.496 47.529,46.79 46.512,60.737 C45.822,70.204 48.292,78.9 52.43,83.69 C54.388,85.955 56.719,87.346 59.265,87.532 C67.195,88.11 74.754,76.816 75.77,62.87 z"
            fill={color}
          />
          <path
            d="M53.386,24.928 C53.568,22.434 52.587,19.914 50.574,17.584 C49.62,16.481 48.436,15.421 47.034,14.425 C42.308,11.071 35.805,8.94 28.723,8.424 C14.777,7.407 2.506,13.247 1.928,21.177 C1.35,29.106 12.644,36.665 26.59,37.682 C40.537,38.699 52.808,32.858 53.386,24.928 z"
            fill={color}
          />
          <path
            d="M17.078,46.651 L14.687,48.717 C8.567,54.005 7.891,63.286 13.179,69.406 C18.467,75.525 27.748,76.202 33.867,70.914 L36.257,68.849 C31.782,68.03 27.031,65.246 23.167,60.774 C19.303,56.302 17.237,51.198 17.078,46.651 z"
            fill={color}
          />
          <path
            d="M31.674,42.593 C29.889,42.661 28.073,42.635 26.239,42.501 C25.088,42.417 23.951,42.289 22.829,42.129 C20.749,45.843 22.308,52.39 26.823,57.615 C31.339,62.841 37.59,65.332 41.567,63.813 C41.571,62.679 41.61,61.536 41.693,60.385 C41.827,58.552 42.064,56.753 42.39,54.998 C40.167,53.642 38.02,51.834 36.094,49.605 C34.167,47.376 32.692,44.989 31.674,42.593 z"
            fill={color}
          />
          <path
            d="M57.325,19.399 C58.085,21.324 58.352,23.258 58.205,25.28 C57.977,28.399 56.652,31.297 54.367,33.814 C57.189,31.919 60.249,31.028 63.368,31.255 C65.39,31.402 67.265,31.947 69.059,32.978 L69.641,32.475 C73.384,29.24 73.798,23.562 70.563,19.818 C67.328,16.075 61.65,15.661 57.907,18.896 L57.325,19.399 z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  )
}

export const BeStyledLogoStr = (theme, size, color) =>
  encodeURIComponent(
    renderToStaticMarkup(
      <BeStyledLogo size={size} theme={theme} color={color} />
    )
  )
