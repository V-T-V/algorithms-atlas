import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  geneticAlgorithm,
  fitness,
} from '../../src/algorithms/ai-search/ais-genetic-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-genetic-search/trace.ts';

test('GA 在 OneMax 上趋近最优', () => {
  const r = geneticAlgorithm(6, 20, 30, 0.1, 3);
  assert.ok(r.fit >= 4);
});
test('GA 同种子可复现', () => {
  const a = geneticAlgorithm(6, 10, 10, 0.1, 5);
  const b = geneticAlgorithm(6, 10, 10, 0.1, 5);
  assert.deepEqual(a.best, b.best);
});
test('fitness 全 1 = n', () => {
  assert.equal(fitness([1, 1, 1, 1, 1]), 5);
});
test('GA trace 非空', () => assert.ok(buildTrace().length > 0));
