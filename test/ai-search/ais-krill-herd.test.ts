import { test } from 'node:test';
import assert from 'node:assert/strict';
import { krillHerd } from '../../src/algorithms/ai-search/ais-krill-herd/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-krill-herd/trace.ts';

test('Krill 在 sphere 上改进', () => {
  const r = krillHerd(2, 12, 40, 0.5, 0.3, 0.2, 53);
  assert.ok(r.fit < 10, 'fit=' + r.fit);
});
test('Krill 同种子可复现', () => {
  const a = krillHerd(2, 8, 20, 0.5, 0.3, 0.2, 5);
  const b = krillHerd(2, 8, 20, 0.5, 0.3, 0.2, 5);
  assert.deepEqual(a.best, b.best);
});
test('Krill trace 非空', () => assert.ok(buildTrace().length > 0));
