import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WeightedRandom,
  weightedRandom,
  makeRng,
} from '../../src/algorithms/randomized/rand-weighted-random/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-weighted-random/trace.ts';

test('rand-weighted-random 权重为零时仍返回', () => {
  const wr = new WeightedRandom([0, 0, 1]);
  const idx = wr.pick(makeRng(1));
  // 只有 idx 2 有效
  assert.equal(idx, 2);
});

test('rand-weighted-random 分布近似权重比', () => {
  const wr = new WeightedRandom([1, 3]);
  const s = wr.sample(4000, makeRng(5));
  const c0 = s.filter((x) => x === 0).length;
  // 1:3 比例，c0 约 1000
  assert.ok(c0 > 700 && c0 < 1300, `c0=${c0}`);
});

test('rand-weighted-random 负权重抛错', () => {
  assert.throws(() => new WeightedRandom([-1, 2]));
});

test('rand-weighted-random 确定性', () => {
  assert.deepEqual(
    weightedRandom([1, 2, 3], 5, makeRng(7)),
    weightedRandom([1, 2, 3], 5, makeRng(7)),
  );
});

test('rand-weighted-random trace', () => {
  assert.ok(buildTrace().length > 2);
});
