import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wolfPack, rastrigin } from '../../src/algorithms/ai-search/ais-wolf-pack/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-wolf-pack/trace.ts';

test('WolfPack 在 Rastrigin 上改进', () => {
  const r = wolfPack(2, 12, 40, 1.0, 0.3, 31);
  assert.ok(r.fit < rastrigin([5, 5]));
});
test('WolfPack 同种子可复现', () => {
  const a = wolfPack(2, 8, 20, 1, 0.3, 5);
  const b = wolfPack(2, 8, 20, 1, 0.3, 5);
  assert.deepEqual(a.best, b.best);
});
test('rastrigin(0)=0', () => assert.equal(rastrigin([0, 0]), 0));
test('WolfPack trace 非空', () => assert.ok(buildTrace().length > 0));
