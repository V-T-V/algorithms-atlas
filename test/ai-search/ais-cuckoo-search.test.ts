import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuckoo } from '../../src/algorithms/ai-search/ais-cuckoo-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-cuckoo-search/trace.ts';

test('Cuckoo 在 sphere 上收敛', () => {
  const r = cuckoo(2, 10, 40, 0.25, 0.5, 29);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('Cuckoo 同种子可复现', () => {
  const a = cuckoo(2, 8, 20, 0.25, 0.5, 5);
  const b = cuckoo(2, 8, 20, 0.25, 0.5, 5);
  assert.deepEqual(a.best, b.best);
});
test('Cuckoo trace 非空', () => assert.ok(buildTrace().length > 0));
