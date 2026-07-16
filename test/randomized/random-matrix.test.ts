// 随机矩阵生成 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomUniformMatrix,
  randomBernoulliMatrix,
  randomGaussianMatrix,
  matVec,
  matMul,
  transpose,
  freivaldsCheck,
  makeRng,
  type Matrix,
} from '../../src/algorithms/randomized/random-matrix/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/randomized/random-matrix/trace.ts';

test('uniform 矩阵维度正确', () => {
  const M = randomUniformMatrix(3, 4, 0, 10, makeRng(42));
  assert.equal(M.length, 3);
  assert.equal(M[0]!.length, 4);
});

test('uniform 元素在 [a,b) 内', () => {
  const M = randomUniformMatrix(5, 5, 2, 8, makeRng(1));
  for (const row of M)
    for (const v of row) {
      assert.ok(v >= 2 && v < 8, `值 ${v} 越界`);
    }
});

test('uniform 同种子可复现', () => {
  const a = randomUniformMatrix(3, 3, 0, 1, makeRng(7));
  const b = randomUniformMatrix(3, 3, 0, 1, makeRng(7));
  assert.deepEqual(a, b);
});

test('bernoulli 矩阵元素仅为 0/1', () => {
  const M = randomBernoulliMatrix(6, 6, makeRng(42));
  for (const row of M)
    for (const v of row) {
      assert.ok(v === 0 || v === 1);
    }
});

test('bernoulli 0/1 各约一半（大样本）', () => {
  const M = randomBernoulliMatrix(100, 100, makeRng(1));
  const ones = M.flat().filter((x) => x === 1).length;
  const total = 10000;
  // 容差：比例应在 [0.45, 0.55]
  assert.ok(ones / total > 0.45 && ones / total < 0.55, `1 占比 ${ones / total}`);
});

test('gaussian 矩阵均值约 mu', () => {
  const M = randomGaussianMatrix(50, 50, 5, 1, makeRng(2));
  const mean = M.flat().reduce((a, b) => a + b, 0) / 2500;
  assert.ok(Math.abs(mean - 5) < 0.3, `均值 ${mean} 偏离 5`);
});

test('matVec 矩阵-向量乘', () => {
  const A: Matrix = [
    [1, 2],
    [3, 4],
  ];
  assert.deepEqual(matVec(A, [1, 1]), [3, 7]);
  assert.deepEqual(matVec(A, [2, 0]), [2, 6]);
});

test('matMul 矩阵乘', () => {
  const A: Matrix = [
    [1, 2],
    [3, 4],
  ];
  const B: Matrix = [
    [1, 0],
    [0, 1],
  ];
  assert.deepEqual(matMul(A, B), A); // A·I = A
});

test('transpose 转置', () => {
  const A: Matrix = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  assert.deepEqual(transpose(A), [
    [1, 4],
    [2, 5],
    [3, 6],
  ]);
});

test('freivaldsCheck 正确乘法通过', () => {
  const A: Matrix = [
    [2, 1],
    [3, 4],
  ];
  const B: Matrix = [
    [1, 0],
    [2, 3],
  ];
  const C = matMul(A, B);
  assert.equal(freivaldsCheck(A, B, C, makeRng(42)), true);
});

test('freivaldsCheck 错误乘法至少一次失败', () => {
  const A: Matrix = [
    [2, 1],
    [3, 4],
  ];
  const B: Matrix = [
    [1, 0],
    [2, 3],
  ];
  const wrong: Matrix = [
    [5, 3],
    [11, 12],
  ]; // (0,0) 错
  let failed = false;
  for (let s = 1; s <= 10; s++) {
    if (!freivaldsCheck(A, B, wrong, makeRng(s))) failed = true;
  }
  assert.ok(failed);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
    assert.ok(f.array2d === undefined || Array.isArray(f.array2d));
  }
});

test('DEFAULT_INPUT.kind=bernoulli', () => {
  assert.equal(DEFAULT_INPUT.kind, 'bernoulli');
});
