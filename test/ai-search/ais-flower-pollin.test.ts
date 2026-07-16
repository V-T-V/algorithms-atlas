import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flowerPollination } from '../../src/algorithms/ai-search/ais-flower-pollin/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-flower-pollin/trace.ts';

test('FPA 在 sphere 上收敛', () => {
  const r = flowerPollination(2, 12, 40, 0.8, 43);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('FPA 同种子可复现', () => {
  const a = flowerPollination(2, 8, 20, 0.8, 5);
  const b = flowerPollination(2, 8, 20, 0.8, 5);
  assert.deepEqual(a.best, b.best);
});
test('FPA trace 非空', () => assert.ok(buildTrace().length > 0));
