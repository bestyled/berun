import * as jestApi from 'jest'

export default berun => {
  const argv = process.argv.slice(3) // 0 = node, 1 = script, 2 = sparky cmd= 'test', 3+ = args

  // Watch unless on CI, in coverage mode, or explicitly running all tests
  if (
    !process.env.CI &&
    argv.indexOf('--coverage') === -1 &&
    argv.indexOf('--watchAll') === -1
  ) {
    argv.push('--watch')
  }

  argv.push('--config', JSON.stringify(berun.jest.toConfig()))

  return jestApi.run(argv)
}
