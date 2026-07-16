import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscValidNumber } from '../../src/algorithms/misc/misc-valid-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-valid-number/trace.ts';
test('valid "0"=true', () => {
  assert.equal(miscValidNumber('0'), true);
});
test('valid " 0.1 "=true', () => {
  assert.equal(miscValidNumber(' 0.1 '), true);
});
test('valid "abc"=false', () => {
  assert.equal(miscValidNumber('abc'), false);
});
test('valid "1 a"=false', () => {
  assert.equal(miscValidNumber('1 a'), false);
});
test('valid "2e10"=true', () => {
  assert.equal(miscValidNumber('2e10'), true);
});
test('valid " -1.23e+4 "=true', () => {
  assert.equal(miscValidNumber(' -1.23e+4 '), true);
});
test('valid "e3"=false', () => {
  assert.equal(miscValidNumber('e3'), false);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
