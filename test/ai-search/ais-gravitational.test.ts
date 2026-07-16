import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gsa } from '../../src/algorithms/ai-search/ais-gravitational/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-gravitational/trace.ts';

test('GSA 在 sphere 上改进', () => {
  const r = gsa(2, 12, 40, 50, 41);
  assert.ok(r.fit < 50, 'fit=' + r.fit);
});
test('GSA 同种子可复现', () => {
  const a = gsa(2, 8, 20, 50, 5);
  const b = gsa(2, 8, 20, 50, 5);
  assert.deepEqual(a.best, b.best);
});
test('GSA trace 非空', () => assert.ok(buildTrace().length > 0));
