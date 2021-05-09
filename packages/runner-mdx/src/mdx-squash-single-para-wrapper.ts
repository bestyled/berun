/**
 * Workaround for @mdx-js/mdx V2 remark parser that adds an extra
 * paragraph on outer most JSX elements.
 *
 * See https://github.com/mdx-js/mdx/issues/1451
 */

const visit = require('unist-util-visit')

const splice = [].splice

function attacher() {
  return function transformer(tree, file) {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (
        parent &&
        parent.type === 'root' &&
        Array.isArray(node.children) &&
        node.children.length === 1
      ) {
        splice.apply(parent.children, [index, 1].concat(node.children))
        return [visit.SKIP, index]
      }
    })
  }
}

module.exports = attacher
