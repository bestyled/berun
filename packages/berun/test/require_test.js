import { join } from 'path';
import BeRun from '../src/berun';

const testModulePath = join(__dirname, 'fixtures', 'test-module');

beforeAll(() => {
  process.chdir(testModulePath);
});

test('requires middleware relative to root', () => {
  expect(() => new BeRun().use('middleware')).not.toThrow();
});

test('requires middleware from root/node_modules', () => {
  expect(() => new BeRun().use('alpha')).not.toThrow();
});

test('throws if middleware cannot be found', () => {
  expect(() => new BeRun().use('nonExistent')).toThrow();
});
