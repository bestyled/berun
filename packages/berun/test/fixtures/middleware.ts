export default api =>
  api.webpack.module.rule('compile').test(api.regexFromExtensions(['js']))
