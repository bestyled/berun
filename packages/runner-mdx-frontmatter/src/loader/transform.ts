const matter = require('gray-matter')

export default async function (src) {
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

function stringify(objFromJson) {
  if (typeof objFromJson !== 'object' || Array.isArray(objFromJson)) {
    return JSON.stringify(objFromJson)
  }
  const props = Object.keys(objFromJson)
    .map((key) => `${key}:${stringify(objFromJson[key])}`)
    .join(',')
  return `{${props}}`
}
