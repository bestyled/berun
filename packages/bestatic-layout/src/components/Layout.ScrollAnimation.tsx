import React, { useLayoutEffect } from 'react'

import { Head, Body } from '@bestatic/layout'

declare global {
  const sal: Function
}

const SAL_SCRIPT = `window.addEventListener('load', function (){ 
  sal();
});`

export const ScrollAnimation = () => {
  useLayoutEffect(() => {
    if (window && window['sal']) window['sal']()
  })

  return (
    <>
      <Head>
        <link
          key="sal"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/sal.js@0.5.0/dist/sal.css"
        />
      </Head>
      <Body>
        <script
          key="sal-js"
          src="https://cdn.jsdelivr.net/npm/sal.js@0.5.0/dist/sal.min.js"
        />
        <script
          key="sal-js-load"
          dangerouslySetInnerHTML={{ __html: SAL_SCRIPT }}
        />
      </Body>
    </>
  )
}
