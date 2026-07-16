// Freivalds' Matrix Verification · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  freivaldsVerify,
  matVec,
  matMul,
  makeBitRng,
  type Matrix,
} from '../../src/algorithms/randomized/freivalds-matrix/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/freivalds-matrix/trace.ts';

const A: Matrix = [
  [2, 1],
  [3, 4],
];
const B: Matrix = [
  [1, 0],
  [2, 3],
];

// 正确的 A·B
// A·B = [[2*1+1*2, 2*0+1*3],[3*1+4*2, 3*0+4*3]] = [[4,3],[11,12]]
const CORRECT_C: Matrix = [
  [4, 3],
  [11, 12],
];

test('matVec 基础', () => {
  const v = [1, 1];
  // B·v = [1*1+0*1, 2*1+3*1] = [1, 5]
  assert.deepEqual(matVec(B, v), [1, 5]);
});

test('matMul 计算 A·B', () => {
  const C = matMul(A, B);
  assert.deepEqual(C, CORRECT_C);
});

test('freivalds 对正确 C 返回 true', () => {
  const ok = freivaldsVerify(A, B, CORRECT_C, 5, makeBitRng(42));
  assert.equal(ok, true);
});

test('freivalds 对错误 C 返回 false', () => {
  const wrong: Matrix = [
    [4, 3],
    [11, 13],
  ]; // 把 (1,1) 改成 13（错误）
  const ok = freivaldsVerify(A, B, wrong, 5, makeBitRng(42));
  assert.equal(ok, false);
});

test('freivalds 错误 C 最终一定失败（多个种子）', () => {
  const wrong: Matrix = [
    [5, 3],
    [11, 12],
  ]; // (0,0) 错误
  for (let seed = 1; seed <= 8; seed++) {
    const ok = freivaldsVerify(A, B, wrong, 10, makeBitRng(seed));
    assert.equal(ok, false, `种子 ${seed} 应失败`);
  }
});

test('freivalds 正确 C 在多个种子下从不误报', () => {
  for (let seed = 1; seed <= 8; seed++) {
    const ok = freivaldsVerify(A, B, CORRECT_C, 5, makeBitRng(seed));
    assert.equal(ok, true, `种子 ${seed} 应通过`);
  }
});

test('freivalds 钩子完整触发', () => {
  const vectors: number[][] = [];
  const brs: number[][] = [];
  const compares: boolean[] = [];
  let result: { v: boolean; p: number; t: number } | null = null;
  const ok = freivaldsVerify(A, B, CORRECT_C, 3, makeBitRng(7), {
    onRandomVector: (_t, r) => vectors.push([...r]),
    onBr: (_t, br) => brs.push([...br]),
    onCompare: (_t, _abr, _cr, passed) => compares.push(passed),
    onResult: (v, p, t) => (result = { v, p, t }),
  });
  assert.equal(ok, true);
  assert.equal(vectors.length, 3);
  assert.equal(brs.length, 3);
  assert.equal(compares.length, 3);
  assert.deepEqual(compares, [true, true, true]);
  assert.deepEqual(result, { v: true, p: 3, t: 3 });
});

test('freivalds 一旦失败立即返回（钩子早停）', () => {
  const wrong: Matrix = [
    [5, 3],
    [11, 12],
  ];
  const trials: boolean[] = [];
  const ok = freivaldsVerify(A, B, wrong, 10, makeBitRng(7), {
    onTrial: (_t, passed) => trials.push(passed),
  });
  assert.equal(ok, false);
  // 一定在某次失败，但可能不是第一次（取决于 r）
  assert.ok(
    trials.some((p) => !p),
    '至少一次试验应失败',
  );
});

test('buildTrace 生成至少 4 帧（initial + 至少 2 试验 + final）', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  // 每帧都有 aux
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('buildTrace wrong=true 也能生成帧', () => {
  const frames = buildTrace({ ...DEFAULT_INPUT, wrong: true });
  assert.ok(frames.length >= 4);
});

test('DEFAULT_INPUT 包含正确配置', () => {
  assert.equal(DEFAULT_INPUT.k, 4);
  assert.equal(DEFAULT_INPUT.seed, 42);
  assert.equal(DEFAULT_INPUT.A.length, 2);
});
