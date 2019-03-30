const matter = require('gray-matter')

module.exports = async function(src) {
  const { content, data } = matter(src)

  const { Layout, Root, ...meta } = data

  const code = [
    Object.keys(meta).length > 0 && `export const meta = ${stringify(meta)}`,
    Layout &&
      `import Layout from ${stringify(
        Layout
      )}\n\nexport default (props) => <><Layout meta={meta} {...props}/>{props.children}</>`,
    Root && `export {default as Root} from ${stringify(Root)}`,
    '',
    `${content}`
  ]
    .filter(Boolean)
    .join('\n')

  return code
}

function stringify(obj_from_json) {
  if (typeof obj_from_json !== 'object' || Array.isArray(obj_from_json)) {
    return JSON.stringify(obj_from_json)
  }
  let props = Object.keys(obj_from_json)
    .map(key => `${key}:${stringify(obj_from_json[key])}`)
    .join(',')
  return `{${props}}`
}
