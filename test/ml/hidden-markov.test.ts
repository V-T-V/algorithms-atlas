import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  forward,
  backward,
  validateHMM,
  type HMM,
} from '../../src/algorithms/ml/hidden-markov/impl.ts';

const MODEL: HMM = {
  A: [
    [0.7, 0.3],
    [0.4, 0.6],
  ],
  B: [
    [0.9, 0.1],
    [0.2, 0.8],
  ],
  pi: [0.6, 0.4],
};

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('forward: 与 backward 结果一致', () => {
  const obs = [0, 1, 1, 0];
  assert.ok(close(forward(MODEL, obs), backward(MODEL, obs), 1e-9));
});

test('forward: 概率值在 [0,1]', () => {
  const p = forward(MODEL, [0, 1, 0]);
  assert.ok(p >= 0 && p <= 1);
});

test('forward: 单步观测 = π·B[:,o] 之和', () => {
  // obs=[0] → P = π_0·B[0][0] + π_1·B[1][0]
  const expected = MODEL.pi[0]! * MODEL.B[0]![0]! + MODEL.pi[1]! * MODEL.B[1]![0]!;
  assert.ok(close(forward(MODEL, [0]), expected));
});

test('forward: 空观测序列 → 概率 1', () => {
  assert.equal(forward(MODEL, []), 1);
  assert.equal(backward(MODEL, []), 1);
});

test('forward: 手算两步验证', () => {
  // obs=[0,1]
  // α1[0] = 0.6·0.9 = 0.54; α1[1] = 0.4·0.2 = 0.08
  // α2[0] = (0.54·0.7 + 0.08·0.4)·B[0][1] = (0.378+0.032)·0.1 = 0.041
  // α2[1] = (0.54·0.3 + 0.08·0.6)·B[1][1] = (0.162+0.048)·0.8 = 0.168
  // P = 0.041 + 0.168 = 0.209
  assert.ok(close(forward(MODEL, [0, 1]), 0.209, 1e-6));
});

test('validateHMM: 合法模型返回 true', () => {
  assert.equal(validateHMM(MODEL), true);
});

test('validateHMM: 非法转移概率返回 false', () => {
  const bad: HMM = {
    A: [
      [0.5, 0.6],
      [0.4, 0.6],
    ],
    B: MODEL.B,
    pi: MODEL.pi,
  };
  assert.equal(validateHMM(bad), false);
});

test('forward: hooks 正确回调', () => {
  const steps: number[] = [];
  let done: number | null = null;
  forward(MODEL, [0, 1, 0], {
    onForwardStep: (t) => steps.push(t),
    onDone: (p) => (done = p),
  });
  assert.deepEqual(steps, [0, 1, 2]);
  assert.ok(done !== null);
});

test('backward: hooks 正确回调', () => {
  const steps: number[] = [];
  let done: number | null = null;
  backward(MODEL, [0, 1, 0], {
    onBackwardStep: (t) => steps.push(t),
    onDone: (p) => (done = p),
  });
  // 后向从 T-1 到 0
  assert.deepEqual(steps, [2, 1, 0]);
  assert.ok(done !== null);
});
