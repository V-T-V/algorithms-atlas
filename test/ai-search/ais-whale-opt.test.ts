import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whaleOpt } from '../../src/algorithms/ai-search/ais-whale-opt/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-whale-opt/trace.ts';

test('WOA 在 sphere 上收敛', () => {
  const r = whaleOpt(2, 12, 40, 1, 67);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('WOA 同种子可复现', () => {
  const a = whaleOpt(2, 8, 20, 1, 5);
  const b = whaleOpt(2, 8, 20, 1, 5);
  assert.deepEqual(a.best, b.best);
});
test('WOA trace 非空', () => assert.ok(buildTrace().length > 0));
