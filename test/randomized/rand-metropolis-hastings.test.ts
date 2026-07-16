import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  metropolisHastings,
  sampleGaussian,
  makeRng,
} from '../../src/algorithms/randomized/rand-metropolis-hastings/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-metropolis-hastings/trace.ts';

test('rand-metropolis-hastings 返回 steps 个样本', () => {
  const s = metropolisHastings(100, 0, (x) => Math.exp((-x * x) / 2), makeRng(1));
  assert.equal(s.length, 100);
});

test('rand-metropolis-hastings 均值接近 mu', () => {
  const s = sampleGaussian(5000, 2, 1, makeRng(5));
  // 跳过 burn-in 前 500
  const mean = s.slice(500).reduce((a, b) => a + b, 0) / (s.length - 500);
  assert.ok(Math.abs(mean - 2) < 0.3, `mean=${mean}`);
});

test('rand-metropolis-hastings 确定性', () => {
  const a = metropolisHastings(10, 0, (x) => x * x, makeRng(3));
  const b = metropolisHastings(10, 0, (x) => x * x, makeRng(3));
  assert.deepEqual(a, b);
});

test('rand-metropolis-hastings trace', () => {
  assert.ok(buildTrace().length > 2);
});
