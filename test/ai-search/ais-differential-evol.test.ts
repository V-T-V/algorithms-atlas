import { test } from 'node:test';
import assert from 'node:assert/strict';
import { differentialEvolution } from '../../src/algorithms/ai-search/ais-differential-evol/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-differential-evol/trace.ts';

test('DE 在 sphere 上收敛', () => {
  const r = differentialEvolution(2, 15, 40, 0.7, 0.9, -5, 5, 59);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('DE 同种子可复现', () => {
  const a = differentialEvolution(2, 10, 20, 0.7, 0.9, -5, 5, 5);
  const b = differentialEvolution(2, 10, 20, 0.7, 0.9, -5, 5, 5);
  assert.deepEqual(a.best, b.best);
});
test('DE trace 非空', () => assert.ok(buildTrace().length > 0));
