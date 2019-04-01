import React, { useMemo, memo } from 'react'

import styled, { createGlobalStyle, StyledComponent } from 'styled-components'
import { Head, Body } from '@bestatic/layout'
import { SearchSvgStr } from '../img/search'
import { AlgoliaSvgStr } from '../img/algolia'
import { useSiteData } from '@bestatic/components'

import {
  space,
  display,
  maxWidth,
  textAlign,
  DisplayProps,
  TextAlignProps,
  SpaceProps,
  themeGet
} from 'styled-system'

declare global {
  const docsearch: Function
}

// POLYFILL FOR BTOA

// base64 character set, plus padding character (=)
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
global = global || window
if (!global['btoa'])
  global['btoa'] = function(string) {
    string = String(string)
    var bitmap,
      a,
      b,
      c,
      result = '',
      i = 0,
      rest = string.length % 3 // To determine the final padding

    for (; i < string.length; ) {
      if (
        (a = string.charCodeAt(i++)) > 255 ||
        (b = string.charCodeAt(i++)) > 255 ||
        (c = string.charCodeAt(i++)) > 255
      )
        throw new TypeError(
          "Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range."
        )

      bitmap = (a << 16) | (b << 8) | c
      result +=
        b64.charAt((bitmap >> 18) & 63) +
        b64.charAt((bitmap >> 12) & 63) +
        b64.charAt((bitmap >> 6) & 63) +
        b64.charAt(bitmap & 63)
    }

    // If there's need of padding, replace the last 'A's with equal signs
    return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result
  }

function getAlgoliaLoadScript({apiKey, apiId, indexName}) {
  var DOC_SEARCH = {
    apiId,
    apiKey,
    indexName,
    debug: true
  }
  DOC_SEARCH['inputSelector'] = '#docsearch-input'
  const DOC_SEARCH_CODE = btoa(JSON.stringify(DOC_SEARCH).replace(/a/g, '!Ax6'))
  return `window.addEventListener('load', function DocSearchLoad(){ 
      window.docsearch(JSON.parse(atob("${DOC_SEARCH_CODE}").replace(/!Ax6/g, 'a')));
});`
}

export const SearchBox = memo<any>(props => {
  const siteData = useSiteData()
  const algoliaScript = useMemo(
    () => getAlgoliaLoadScript(siteData.algolia),
    []
  )

  return (
    <>
      <SearchContainer>
        <Search id="docsearch-container">
          <Head>
            <link
              key="docsearch"
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
            />
          </Head>
          <Body>
            <script
              key="docsearch"
              src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
            />
            <script
              key="docsearch-load"
              dangerouslySetInnerHTML={{ __html: algoliaScript }}
            />
          </Body>
          <AlgoliaStyle theme={props.theme} />
          <SearchInput
            id="docsearch-input"
            placeholder="Search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
          />
        </Search>
      </SearchContainer>
    </>
  )
})

SearchBox['isSearchBox'] = true

const SearchContainer = styled.div`
  left: 0;
  position: absolute;
  width: 100%;
  ${space} ${textAlign}
` as StyledComponent<SpaceProps & TextAlignProps, any>

SearchContainer.defaultProps = {
  mt: ['2px', 24, 53],
  textAlign: ['right', 'center']
}

const Search = styled.div`
  font-family: inherit;
  line-height: inherit;
  z-index: 1;

  ${display}
` as StyledComponent<DisplayProps, any>

Search.defaultProps = {
  display: ['block', 'block', 'block']
}

const SearchInput = styled.input`
right: 0;
background: ${p =>
  `#fff url("data:image/svg+xml;utf8,${SearchSvgStr(
    p.theme
  )}") no-repeat 9px center;`}

overflow: visible;
font-family: inherit;
-webkit-font-smoothing: antialiased;
color: black;
line-height: inherit;
border: none;
outline: none;
-webkit-appearance: textfield;
-webkit-box-sizing: content-box;
font-family: inherit;
font-size: 100%;

padding: 4px 5px 4px 32px;

transition: all .5s;
width: 80px;

box-shadow: 0 0 5px 0 #f6bb6954;
z-index: 100;

border: solid 1px #ccc;
border-radius: 10em;

&:focus {
  max-width: 200px;
  width: 200px;
}

&:-moz-placeholder {
	color: #999;
}
&::-webkit-input-placeholder {
	color: #999;
}

${maxWidth}
` as StyledComponent<DisplayProps, any>

SearchInput.defaultProps = {
  maxWidth: [0, 0, 80]
}
const AlgoliaStyle = createGlobalStyle`

${p => `
#docsearch-container .algolia-autocomplete .algolia-docsearch-footer--logo {
 background-image: url("data:image/svg+xml;utf8,${AlgoliaSvgStr(p.theme)}");
}

@media (max-width:${themeGet('breakpoints', ['32em, 48em'])(p)[1]}) {
  #docsearch-container .algolia-autocomplete .ds-dropdown-menu {
    min-width: 0 !important;
    width: 65vw !important;
  }
}

@media (max-width:${themeGet('breakpoints', ['32em'])(p)[0]}) {
  #docsearch-container .algolia-autocomplete .ds-dropdown-menu {
    min-width: 0 !important;
    width: 100vw !important;
    right: 0 !important;
    border-radius: 0 !important;
  }
  #docsearch-container .algolia-autocomplete .ds-dropdown-menu [class^=ds-dataset-] {
    border-radius: 0 !important;
  }
}
`}

#docsearch-container .ds-dropdown-menu {
  box-shadow: 0 0 0 0.0625em rgba(0,0,0,0.2), 0 0 0.625em rgba(0,0,0,0.2);
}

#docsearch-container .algolia-autocomplete .algolia-docsearch-suggestion--highlight {
  background: rgba(243,128,32,0.1);
  color: rgba(0,0,0,0.8);
}

#docsearch-container .algolia-autocomplete .algolia-docsearch-suggestion--text .algolia-docsearch-suggestion--highlight {
  box-shadow: inset 0 -2px 0 0 #f38020;
}

#docsearch-container .algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column {
  color: #222;
}

#docsearch-container .ds-dropdown-menu::before {
  border-top-color: rgba(0,0,0,0.3);
  border-right-color: rgba(0,0,0,0.3);
}

#docsearch-container .ds-dropdown-menu .ds-suggestion .algolia-docsearch-suggestion--subcategory-column::before,
#docsearch-container .ds-dropdown-menu .ds-suggestion .algolia-docsearch-suggestion--content::before {
  background: #d9d9d9;
}

#docsearch-container .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion--subcategory-column::before,
#docsearch-container .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion--content::before {
  background: #fbc99e;
}

#docsearch-container .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion.suggestion-layout-simple .algolia-docsearch-suggestion--content,
#docsearch-container .ds-dropdown-menu .ds-suggestion.ds-cursor .algolia-docsearch-suggestion:not(.suggestion-layout-simple) .algolia-docsearch-suggestion--content {
  background-color: rgba(225,119,69,0.05);
}
`
