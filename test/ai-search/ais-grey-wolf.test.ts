import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greyWolf } from '../../src/algorithms/ai-search/ais-grey-wolf/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-grey-wolf/trace.ts';

test('GWO 在 sphere 上收敛', () => {
  const r = greyWolf(2, 12, 40, 61);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('GWO 同种子可复现', () => {
  const a = greyWolf(2, 8, 20, 5);
  const b = greyWolf(2, 8, 20, 5);
  assert.deepEqual(a.best, b.best);
});
test('GWO trace 非空', () => assert.ok(buildTrace().length > 0));
