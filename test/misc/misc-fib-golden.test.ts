import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibGolden } from '../../src/algorithms/misc/misc-fib-golden/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-fib-golden/trace.ts';
test('F0..F10', () => {
  assert.deepEqual(fibGolden(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
