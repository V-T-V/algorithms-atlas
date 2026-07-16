import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gibbsSample2d,
  makeRng,
} from '../../src/algorithms/randomized/rand-gibbs-sampling/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-gibbs-sampling/trace.ts';

test('rand-gibbs-sampling 返回 steps 个样本', () => {
  const s = gibbsSample2d(50, 0, 0, 0.5, [0, 0], makeRng(1));
  assert.equal(s.length, 50);
});

test('rand-gibbs-sampling 均值接近 (mu0,mu1)', () => {
  const s = gibbsSample2d(5000, 1, -1, 0.3, [0, 0], makeRng(7));
  const m0 = s.slice(500).reduce((a, b) => a + b[0]!, 0) / (s.length - 500);
  const m1 = s.slice(500).reduce((a, b) => a + b[1]!, 0) / (s.length - 500);
  assert.ok(Math.abs(m0 - 1) < 0.3, `m0=${m0}`);
  assert.ok(Math.abs(m1 + 1) < 0.3, `m1=${m1}`);
});

test('rand-gibbs-sampling 确定性', () => {
  const a = gibbsSample2d(10, 0, 0, 0.5, [0, 0], makeRng(3));
  const b = gibbsSample2d(10, 0, 0, 0.5, [0, 0], makeRng(3));
  assert.deepEqual(a, b);
});

test('rand-gibbs-sampling trace', () => {
  assert.ok(buildTrace().length > 2);
});
