import transform from './transform'

export default async function(this: any, src) {
  const callback = this.async()
  try {
    const result = await transform(src)
    return callback(null, result)
  } catch (ex) {
    return callback(ex)
  }
}
