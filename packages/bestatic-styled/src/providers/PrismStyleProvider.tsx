import { createGlobalStyle } from 'styled-components'

import { themeGet } from 'styled-system'

export const GlobalPrismStyle = createGlobalStyle`
a {
  text-decoration: none;
  color: ${props => themeGet('colors.primary', 'blue')(props)}
}

/**
 * GHColors theme by Avi Aryan (http://aviaryan.in)
 * Inspired by Github syntax coloring
 */

code[class*="language-"],
pre[class*="language-"] {
    color: inherit;
    font-family: ${props =>
      themeGet(
        'fonts.mono',
        '"Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace'
      )(props)};
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    font-size: 0.95em;
    line-height: 1.2em;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
    background: ${props => themeGet('colors.neutral', 'blue')(props)};
}

pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
    background: ${props => themeGet('colors.neutral', 'blue')(props)};
}

/* Code blocks */
pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
    border-radius: 2px;
    background-color: ${props =>
      themeGet('colors.tertiaryBackground', 'white')(props)};
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
}

/* Inline code */
:not(pre) > code[class*="language-"] {
    padding: .2em;
    padding-top: 1px; padding-bottom: 1px;
    background: #f8f8f8;
    border: 1px solid #dddddd;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
    color: ${props => themeGet('colors.neutral', 'grey')(props)};
    font-style: italic;
}

.token.namespace {
    opacity: .7;
}

.token.string,
.token.attr-value {
    color:  ${props => themeGet('colors.complement', 'black')(props)};
}
.token.punctuation,
.token.operator {
    color: #393A34; /* no highlight */
}

.token.entity,
.token.url,
.token.symbol,
.token.number,
.token.boolean,
.token.variable,
.token.constant,
.token.property,
.token.regex,
.token.inserted {
    color: ${props => themeGet('colors.secondary', 'black')(props)};
}

.token.atrule,
.token.keyword,
.token.attr-name,
.language-autohotkey .token.selector {
    color: ${props => themeGet('colors.secondary', 'black')(props)};
}

.token.function,
.token.deleted,
.language-autohotkey .token.tag {
    color: ${props => themeGet('colors.primary', 'black')(props)};
}

.token.tag,
.token.selector,
.language-autohotkey .token.keyword {
    color: #00009f;
}

.token.important,
.token.function,
.token.bold {
    font-weight: 500;
}

.token.italic {
    font-style: italic;
}
`

export default GlobalPrismStyle
