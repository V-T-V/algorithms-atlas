import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobi } from '../../src/algorithms/numerical/jacobi/impl.ts';

const closeTo = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) <= eps;

test('jacobi 解 2×2 对角占优方程组', () => {
  // [[4,1],[2,3]] x = [1,2] -> x = [1/11, 6/11] ≈ [0.0909, 0.5454]
  // 实际精确解：4x+y=1, 2x+3y=2 -> x=1/11, y=6/11... 验证 4*(1/11)+6/11 = 10/11≠1
  // 正确解：解 12x=... 重算: 由 2x+3y=2 -> x=(1-y)/4 代入 2(1-y)/4+3y=2 -> (1-y)/2+3y=2 -> 1-y+6y=4 -> 5y=3 -> y=0.6, x=0.1
  const r = jacobi(
    [
      [4, 1],
      [2, 3],
    ],
    [1, 2],
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.x[0]!, 0.1));
  assert.ok(closeTo(r.x[1]!, 0.6));
});

test('jacobi 解 3×3 经典例题 x=[1,2,-1]', () => {
  // A·[1,2,-1] = [6, 22, -10]（b 必须与真解一致）
  const r = jacobi(
    [
      [10, -1, 2],
      [-1, 11, -1],
      [2, -1, 10],
    ],
    [6, 22, -10],
  );
  assert.ok(r.converged);
  assert.ok(closeTo(r.x[0]!, 1));
  assert.ok(closeTo(r.x[1]!, 2));
  assert.ok(closeTo(r.x[2]!, -1));
});

test('jacobi 残差随迭代单调下降（前若干轮）', () => {
  const res: number[] = [];
  jacobi(
    [
      [10, -1, 2],
      [-1, 11, -1],
      [2, -1, 10],
    ],
    [6, 25, -11],
    { maxIter: 5 },
    { onStep: (s) => res.push(s.residual) },
  );
  for (let i = 1; i < res.length; i++)
    assert.ok(res[i]! <= res[i - 1]! + 1e-9, `残差应单调下降 ${res[i]} vs ${res[i - 1]}`);
});

test('jacobi 钩子被调用', () => {
  let calls = 0;
  const r = jacobi(
    [
      [2, 0],
      [0, 2],
    ],
    [4, 6],
    { maxIter: 5 },
    { onStep: () => calls++ },
  );
  assert.ok(r.converged);
  assert.ok(calls >= 1);
  // 对角阵一步即精确
  assert.ok(closeTo(r.x[0]!, 2));
  assert.ok(closeTo(r.x[1]!, 3));
});
