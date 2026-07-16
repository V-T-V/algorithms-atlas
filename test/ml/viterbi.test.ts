import { test } from 'node:test';
import assert from 'node:assert/strict';
import { viterbi, type HMM } from '../../src/algorithms/ml/viterbi/impl.ts';

const MODEL: HMM = {
  A: [
    [0.7, 0.3],
    [0.4, 0.6],
  ],
  B: [
    [0.9, 0.1], // 状态 0 偏观测 0
    [0.2, 0.8], // 状态 1 偏观测 1
  ],
  pi: [0.6, 0.4],
};

test('viterbi: 路径长度 = 观测长度', () => {
  const r = viterbi(MODEL, [0, 1, 0]);
  assert.equal(r.path.length, 3);
});

test('viterbi: 强对应模型 → 路径与观测同下标', () => {
  // B 强对应：状态 i 偏观测 i，故最优状态序列应等于观测序列
  const r = viterbi(MODEL, [0, 1, 1, 0]);
  assert.deepEqual(r.path, [0, 1, 1, 0]);
});

test('viterbi: 单步观测 → 选 π·B 最大的状态', () => {
  // obs=[0]: π_0·B[0][0]=0.54 > π_1·B[1][0]=0.08
  const r = viterbi(MODEL, [0]);
  assert.equal(r.path[0], 0);
});

test('viterbi: 空观测序列', () => {
  const r = viterbi(MODEL, []);
  assert.deepEqual(r.path, []);
});

test('viterbi: 对数概率为有限负数（或 -∞）', () => {
  const r = viterbi(MODEL, [0, 1]);
  assert.ok(r.logProb < 0 || !Number.isFinite(r.logProb));
});

test('viterbi: 最优路径概率 >= 任一固定路径概率', () => {
  // 对比固定路径 [0,0] 与 [0,1] 的对数概率，viterbi 应不劣于任一
  const obs = [0, 1];
  const r = viterbi(MODEL, obs);
  // 手算路径 [0,1] 对数概率
  const lpFixed =
    Math.log(MODEL.pi[0]!) +
    Math.log(MODEL.B[0]![0]!) +
    Math.log(MODEL.A[0]![1]!) +
    Math.log(MODEL.B[1]![1]!);
  assert.ok(r.logProb >= lpFixed - 1e-9);
});

test('viterbi: hooks 正确回调', () => {
  const steps: number[] = [];
  let done: unknown = null;
  viterbi(MODEL, [0, 1, 0], {
    onStep: (t) => steps.push(t),
    onDone: (r) => (done = r),
  });
  assert.deepEqual(steps, [0, 1, 2]);
  assert.ok(done !== null);
});

test('viterbi: 三状态模型', () => {
  const M3: HMM = {
    A: [
      [0.5, 0.3, 0.2],
      [0.2, 0.6, 0.2],
      [0.1, 0.3, 0.6],
    ],
    B: [
      [0.8, 0.2],
      [0.5, 0.5],
      [0.1, 0.9],
    ],
    pi: [0.5, 0.3, 0.2],
  };
  const r = viterbi(M3, [0, 1, 1, 0, 1]);
  assert.equal(r.path.length, 5);
  for (const s of r.path) assert.ok(s >= 0 && s < 3);
});
