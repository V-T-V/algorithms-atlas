import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryPSO,
  makeLcg,
  oneMaxFitness,
} from '../../src/algorithms/optimization/pso-binary/impl.ts';

test('binaryPSO 在 One-Max 上逼近最优', () => {
  const r = binaryPSO(8, oneMaxFitness, 10, 50, 1, 2, 2, makeLcg(42));
  assert.ok(r.bestFitness >= 6, `best=${r.bestFitness} 应 >= 6`);
  assert.equal(r.bestPosition.length, 8);
});

test('binaryPSO 固定种子可复现', () => {
  const r1 = binaryPSO(8, oneMaxFitness, 10, 30, 1, 2, 2, makeLcg(99));
  const r2 = binaryPSO(8, oneMaxFitness, 10, 30, 1, 2, 2, makeLcg(99));
  assert.deepEqual(r1.bestPosition, r2.bestPosition);
  assert.equal(r1.bestFitness, r2.bestFitness);
});

test('binaryPSO 足够迭代达到最优 One-Max', () => {
  const r = binaryPSO(6, oneMaxFitness, 20, 100, 1, 2, 2, makeLcg(7));
  assert.ok(r.bestFitness >= 5);
});

test('binaryPSO 钩子被调用', () => {
  let calls = 0;
  binaryPSO(4, oneMaxFitness, 5, 10, 1, 2, 2, makeLcg(1), { onIter: () => calls++ });
  assert.ok(calls > 0 && calls <= 10);
});
