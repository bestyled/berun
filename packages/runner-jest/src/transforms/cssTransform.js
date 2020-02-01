export default {
  process() {
    return 'export default {};'
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform'
  }
}
