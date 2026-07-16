import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateCardinality } from '../../src/algorithms/randomized/rand-bergs-trotter/impl.ts';
test('估计为正', () => {
  const items = Array.from({ length: 100 }, (_, i) => i + 1);
  assert.ok(estimateCardinality(items, 42) >= 1);
});
