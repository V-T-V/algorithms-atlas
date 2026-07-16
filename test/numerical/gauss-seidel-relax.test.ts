import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sor } from '../../src/algorithms/numerical/gauss-seidel-relax/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/gauss-seidel-relax/trace.ts';

const A = [
  [4, -1, 0, 0],
  [-1, 4, -1, 0],
  [0, -1, 4, -1],
  [0, 0, -1, 3],
];
const b = [15, 10, 10, 10];

test('sor 残差足够小则解正确', () => {
  const { x, converged } = sor(A, b, 1.5, 1000, 1e-10);
  assert.ok(converged, '应收敛');
  // 校验：A x ≈ b
  for (let i = 0; i < b.length; i++) {
    const sum = A[i]!.reduce((acc, a, j) => acc + a * x[j]!, 0);
    assert.ok(Math.abs(sum - b[i]!) < 1e-6, `行 ${i} 不满足: ${sum} vs ${b[i]}`);
  }
});

test('sor ω=1 退化为 Gauss-Seidel', () => {
  const r1 = sor(A, b, 1.0, 1000, 1e-10);
  const r2 = sor(A, b, 1.0, 1000, 1e-10);
  assert.deepEqual(
    r1.x.map((v) => v.toFixed(6)),
    r2.x.map((v) => v.toFixed(6)),
  );
});

test('sor 零对角元报错', () => {
  assert.throws(() =>
    sor(
      [
        [0, 1],
        [1, 0],
      ],
      [1, 1],
      1.5,
    ),
  );
});

test('sor 不同 ω 收敛到同一解', () => {
  // 不同松弛因子应收敛到同一解（线性方程组解唯一）
  const r1 = sor(A, b, 1.0, 1000, 1e-10);
  const r13 = sor(A, b, 1.3, 1000, 1e-10);
  const r17 = sor(A, b, 1.7, 1000, 1e-10);
  assert.ok(r1.converged && r13.converged && r17.converged, '均应收敛');
  for (let i = 0; i < b.length; i++) {
    assert.ok(Math.abs(r1.x[i]! - r13.x[i]!) < 1e-5, `ω=1 vs ω=1.3 解不一致 at ${i}`);
    assert.ok(Math.abs(r1.x[i]! - r17.x[i]!) < 1e-5, `ω=1 vs ω=1.7 解不一致 at ${i}`);
  }
});

test('sor 钩子被调用', () => {
  const iters: number[] = [];
  sor(A, b, 1.5, 10, 1e-10, { onIter: (i) => iters.push(i) });
  assert.ok(iters.length >= 1);
  assert.ok(iters.length <= 10);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
