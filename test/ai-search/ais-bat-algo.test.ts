import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bat } from '../../src/algorithms/ai-search/ais-bat-algo/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bat-algo/trace.ts';

test('Bat 在 sphere 上收敛', () => {
  const r = bat(2, 10, 40, 0, 2, 0.9, 0.5, 0.95, 0.1, 23);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('Bat 同种子可复现', () => {
  const a = bat(2, 8, 20, 0, 2, 0.9, 0.5, 0.95, 0.1, 5);
  const b = bat(2, 8, 20, 0, 2, 0.9, 0.5, 0.95, 0.1, 5);
  assert.deepEqual(a.best, b.best);
});
test('Bat trace 非空', () => assert.ok(buildTrace().length > 0));
