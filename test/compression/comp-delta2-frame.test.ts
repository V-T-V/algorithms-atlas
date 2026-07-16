import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delta2Encode } from '../../src/algorithms/compression/comp-delta2-frame/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-delta2-frame/trace.ts';
test('d2 等差数列常数为0', () => {
  const { d2 } = delta2Encode([1, 3, 5, 7]);
  assert.deepEqual(d2, [1, 0, 0, 0]);
});
test('d2 trace 非空', () => assert.ok(buildTrace().length >= 2));
