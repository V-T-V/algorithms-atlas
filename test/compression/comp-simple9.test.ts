import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simple9Encode } from '../../src/algorithms/compression/comp-simple9/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-simple9/trace.ts';
test('simple9 大值用少位宽', () => {
  const w1 = simple9Encode([1, 1, 1]).length;
  const w2 = simple9Encode([1000000]).length;
  assert.ok(w2 >= w1);
});
test('simple9 trace 非空', () => assert.ok(buildTrace().length >= 2));
