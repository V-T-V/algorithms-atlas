import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerTotientRange } from '../../src/algorithms/misc/misc-euler-totient-range/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-euler-totient-range/trace.ts';
test('φ(1..10)', () => {
  assert.deepEqual(eulerTotientRange(10), [1, 1, 2, 2, 4, 2, 6, 4, 6, 4]);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
