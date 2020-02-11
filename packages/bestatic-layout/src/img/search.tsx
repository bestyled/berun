import * as React from 'react'
import { renderToStaticMarkup } from '@bestatic/core'

export const SearchSvg: React.SFC<{
  theme: { colors: { primaryLight: string } }
}> = ({ theme }) => {
  const color = (theme && theme.colors && theme.colors.primaryLight) || '#777'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17px"
      height="16px"
      viewBox="0 0 17 16"
    >
      <g
        id="search"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="translate(-14.000000, -19.000000)"
      >
        <g transform="translate(0.530419, 0.000000)">
          <rect
            id="search-box"
            x="0"
            y="0"
            width="314"
            height="53.3378673"
            rx="5"
          />
          <path
            d="M29.6084247,32.694674 L26.1325066,29.2246129 C26.1140337,29.2061708 26.0923647,29.1932804 26.0730608,29.1761145 C26.7570073,28.1403544 27.1561891,26.9005182 27.1561891,25.5671949 C27.1561891,21.9402159 24.2110646,19 20.5780945,19 C16.9451245,19 14,21.9402159 14,25.567131 C14,29.1939823 16.9450606,32.1342621 20.5780306,32.1342621 C21.9136438,32.1342621 23.155486,31.7357456 24.1929752,31.0529391 C24.2101697,31.072147 24.2230177,31.0937798 24.2414906,31.112222 L27.7174726,34.5824106 C28.2396369,35.1036409 29.0861964,35.1036409 29.6084247,34.5824106 C30.1305251,34.0611166 30.1305251,33.215968 29.6084247,32.694674 Z M20.5780945,29.8576448 C18.2044808,29.8576448 16.2803541,27.9367249 16.2803541,25.567131 C16.2803541,23.1974733 18.2045447,21.2765535 20.5780945,21.2765535 C22.9515804,21.2765535 24.875771,23.1975372 24.875771,25.567131 C24.875771,27.9367249 22.9515804,29.8576448 20.5780945,29.8576448 Z"
            id="Shape"
            fill={color}
            fillRule="nonzero"
          />
        </g>
      </g>
    </svg>
  )
}

export const SearchSvgStr = theme =>
  encodeURIComponent(renderToStaticMarkup(<SearchSvg theme={theme} />))
