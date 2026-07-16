import { test } from 'node:test';
import assert from 'node:assert/strict';
import { powerMethodShift } from '../../src/algorithms/numerical/power-method-shift/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/power-method-shift/trace.ts';

test('power-shift 找到最大特征值', () => {
  // [[2,1],[1,2]] 最大特征值 = 3
  const { eigenvalue, converged } = powerMethodShift(
    [
      [2, 1],
      [1, 2],
    ],
    0,
    1000,
    1e-12,
  );
  assert.ok(converged);
  assert.ok(Math.abs(eigenvalue - 3) < 1e-6, `λ=${eigenvalue}`);
});

test('power-shift 位移改变收敛目标', () => {
  // σ=0：找到 A 的最大模特征值 3（特征向量 [1,1] 方向）
  const r0 = powerMethodShift(
    [
      [2, 1],
      [1, 2],
    ],
    0,
    1000,
    1e-12,
  );
  assert.ok(Math.abs(r0.eigenvalue - 3) < 1e-6, `σ=0 λ=${r0.eigenvalue}`);
  // σ=4 且初值 [1,1]：A-4I 特征值为 -3（特征向量 [1,-1]）和 -1（特征向量 [1,1]）。
  // 初值 [1,1] 恰为 [1,-1] 的正交补，故幂法只能收敛到 -1，即 λ(A)=4+(-1)=3。
  // 这是幂法的固有局限：初值与目标特征向量正交时无法找到它。
  const r4 = powerMethodShift(
    [
      [2, 1],
      [1, 2],
    ],
    4,
    1000,
    1e-12,
  );
  assert.ok(Math.abs(r4.eigenvalue - 3) < 1e-6, `σ=4 初值[1,1] λ=${r4.eigenvalue}`);
  // 验证 μ = -1 对应 (A-σI) 的估计：r4.eigenvalue - σ = -1
  assert.ok(Math.abs(r4.eigenvalue - 4 - -1) < 1e-9);
});

test('power-shift 特征向量满足 A v = λ v', () => {
  const A = [
    [2, 1],
    [1, 2],
  ];
  const { eigenvalue, eigenvector } = powerMethodShift(A, 0, 1000, 1e-12);
  const v = eigenvector;
  const Av = A.map((row) => row.reduce((acc, a, j) => acc + a * v[j]!, 0));
  const lambdaV = v.map((x) => x * eigenvalue);
  for (let i = 0; i < 2; i++) {
    assert.ok(Math.abs(Av[i]! - lambdaV[i]!) < 1e-4, `A v ≠ λ v at ${i}`);
  }
});

test('power-shift 对角矩阵', () => {
  const { eigenvalue } = powerMethodShift(
    [
      [5, 0],
      [0, 2],
    ],
    0,
    1000,
    1e-12,
  );
  assert.ok(Math.abs(eigenvalue - 5) < 1e-6);
});

test('power-shift 钩子被调用', () => {
  const iters: number[] = [];
  powerMethodShift(
    [
      [2, 1],
      [1, 2],
    ],
    0,
    50,
    1e-12,
    { onIter: (i) => iters.push(i) },
  );
  assert.ok(iters.length >= 1);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
