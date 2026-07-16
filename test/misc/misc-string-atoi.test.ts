import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscStringAtoi } from '../../src/algorithms/misc/misc-string-atoi/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-string-atoi/trace.ts';
test('atoi "42"=42', () => {
  assert.equal(miscStringAtoi('42'), 42);
});
test('atoi "   -42"=-42', () => {
  assert.equal(miscStringAtoi('   -42'), -42);
});
test('atoi "4193 with words"=4193', () => {
  assert.equal(miscStringAtoi('4193 with words'), 4193);
});
test('atoi 溢出截断', () => {
  assert.equal(miscStringAtoi('-91283472332'), -2147483648);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
