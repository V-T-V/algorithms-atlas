import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tlbo } from '../../src/algorithms/ai-search/ais-teaching-learning/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-teaching-learning/trace.ts';

test('TLBO 在 sphere 上收敛', () => {
  const r = tlbo(2, 15, 40, 47);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('TLBO 同种子可复现', () => {
  const a = tlbo(2, 10, 20, 5);
  const b = tlbo(2, 10, 20, 5);
  assert.deepEqual(a.best, b.best);
});
test('TLBO trace 非空', () => assert.ok(buildTrace().length > 0));
