import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscNthUgly2 } from '../../src/algorithms/misc/misc-nth-ugly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-nth-ugly-2/trace.ts';
test('第 10 个丑数 = 12', () => {
  assert.equal(miscNthUgly2(10), 12);
});
test('第 1 个丑数 = 1', () => {
  assert.equal(miscNthUgly2(1), 1);
});
test('第 11 个 = 15', () => {
  assert.equal(miscNthUgly2(11), 15);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
