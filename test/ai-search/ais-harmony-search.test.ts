import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harmonySearch } from '../../src/algorithms/ai-search/ais-harmony-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-harmony-search/trace.ts';

test('Harmony 在 sphere 上收敛', () => {
  const r = harmonySearch(2, 10, 50, 0.9, 0.3, 0.3, -5, 5, 37);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('Harmony 同种子可复现', () => {
  const a = harmonySearch(2, 8, 20, 0.9, 0.3, 0.3, -5, 5, 5);
  const b = harmonySearch(2, 8, 20, 0.9, 0.3, 0.3, -5, 5, 5);
  assert.deepEqual(a.best, b.best);
});
test('Harmony trace 非空', () => assert.ok(buildTrace().length > 0));
