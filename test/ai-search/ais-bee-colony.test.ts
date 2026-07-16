import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abc, sphere } from '../../src/algorithms/ai-search/ais-bee-colony/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bee-colony/trace.ts';

test('ABC 在 sphere 上收敛', () => {
  const r = abc(2, 10, 40, 15, 17);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('ABC 同种子可复现', () => {
  const a = abc(2, 8, 20, 10, 3);
  const b = abc(2, 8, 20, 10, 3);
  assert.deepEqual(a.best, b.best);
});
test('ABC trace 非空', () => assert.ok(buildTrace().length > 0));
