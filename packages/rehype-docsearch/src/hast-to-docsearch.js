const visit = require('unist-util-visit')
const is = require('hast-util-is-element')
const selectAll = require('hast-util-select').selectAll

const ROOT = "#tdx"
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const TEXT = ['p', 'ul']

const DEFAULT_HIERARCHY = [null, null, null, null, null, null, null]

module.exports = function hastToDocsearch(options) {

  const url = options.url || "http://localhost"

  this.Compiler = (tree, file) => {

    const parts = [];
    let hierarchy = ([]).concat(DEFAULT_HIERARCHY)
    let anchor = null

    let start = (selectAll(
      ROOT,
      tree
    )).slice(-1)[0] || tree

    if (start) {
      visit(start, node => {
        if (node.type === 'element' && is(node, HEADINGS)) {
          const value = getPlainText(node)
          switch (node.tagName) {
            case 'h1':
              hierarchy = ([]).concat(value).concat(DEFAULT_HIERARCHY.slice(1))
              break;
            case 'h2':
              hierarchy = hierarchy.slice(0, 1).concat(value).concat(DEFAULT_HIERARCHY.slice(2))
              break;
            case 'h3':
              hierarchy = hierarchy.slice(0, 2).concat(value).concat(DEFAULT_HIERARCHY.slice(3))
              break;
            case 'h4':
              hierarchy = hierarchy.slice(0, 3).concat(value).concat(DEFAULT_HIERARCHY.slice(4))
              break;
            case 'h5':
              hierarchy = hierarchy.slice(0, 4).concat(value).concat(DEFAULT_HIERARCHY.slice(5))
              break;
            case 'h6':
              hierarchy = hierarchy.slice(0, 5).concat(value).concat(DEFAULT_HIERARCHY.slice(6))
              break
          }
          anchor = node.properties.id
          parts.push({
            hierarchy: hierarchy.reduce((accum, val, i) => Object.assign(accum, { [`lvl${i}`]: val }), {}),
            content: null,
            url: `${url}/#${anchor}`,
            anchor
          })
        } else if (node.type === 'element' && is(node, TEXT)) {
          const value = getPlainText(node)
          parts.push({
            hierarchy: hierarchy.reduce((accum, val, i) => Object.assign(accum, { [`lvl${i}`]: val }), {}),
            content: value,
            url: anchor ? `${url}/#${anchor}` : `${url}`,
            anchor,
          })
        }

      })
    }

    return parts

  }

}

function getPlainText(tree) {
  var parts = [];
  visit(tree, 'text', function (node) {
    parts.push(node.value);
  });
  return parts.join('');
}