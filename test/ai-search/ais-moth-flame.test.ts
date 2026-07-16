import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mothFlame } from '../../src/algorithms/ai-search/ais-moth-flame/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-moth-flame/trace.ts';

test('MFO 在 sphere 上改进', () => {
  const r = mothFlame(2, 12, 40, 1, 71);
  assert.ok(r.fit < 10, 'fit=' + r.fit);
});
test('MFO 同种子可复现', () => {
  const a = mothFlame(2, 8, 20, 1, 5);
  const b = mothFlame(2, 8, 20, 1, 5);
  assert.deepEqual(a.best, b.best);
});
test('MFO trace 非空', () => assert.ok(buildTrace().length > 0));
