import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firefly } from '../../src/algorithms/ai-search/ais-firefly/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-firefly/trace.ts';

test('Firefly 在 sphere 上收敛', () => {
  const r = firefly(2, 12, 40, 1, 1, 0.2, 19);
  assert.ok(r.fit < 2, 'fit=' + r.fit);
});
test('Firefly 同种子可复现', () => {
  const a = firefly(2, 8, 20, 1, 1, 0.2, 5);
  const b = firefly(2, 8, 20, 1, 1, 0.2, 5);
  assert.deepEqual(a.best, b.best);
});
test('Firefly trace 非空', () => assert.ok(buildTrace().length > 0));
