import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscUgly2 } from '../../src/algorithms/misc/misc-ugly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-ugly-2/trace.ts';
test('6 是丑数', () => {
  assert.equal(miscUgly2(6), true);
});
test('14 不是丑数', () => {
  assert.equal(miscUgly2(14), false);
});
test('1 是丑数', () => {
  assert.equal(miscUgly2(1), true);
});
test('非正数非丑', () => {
  assert.equal(miscUgly2(-6), false);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
