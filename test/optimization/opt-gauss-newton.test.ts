import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gaussNewton,
  solveLinear,
  type GaussNewtonHooks,
  type Mat,
  type Vec,
} from '../../src/algorithms/optimization/opt-gauss-newton/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/opt-gauss-newton/trace.ts';

test('opt-gauss-newton solveLinear 解 2x2', () => {
  const A: Mat = [
    [2, 1],
    [1, 3],
  ];
  const b: Vec = [3, 4];
  const x = solveLinear(A, b);
  assert.ok(Math.abs(x[0]! - 1) < 1e-9);
  assert.ok(Math.abs(x[1]! - 1) < 1e-9);
});

test('opt-gauss-newton solveLinear 解 3x3', () => {
  const A: Mat = [
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 4],
  ];
  const x = solveLinear(A, [1, 2, 8]);
  assert.ok(Math.abs(x[0]! - 1) < 1e-9);
  assert.ok(Math.abs(x[1]! - 1) < 1e-9);
  assert.ok(Math.abs(x[2]! - 2) < 1e-9);
});

test('opt-gauss-newton 线性最小二乘精确', () => {
  // 残差线性：r = A·x − y；J=A 常数
  const A: Mat = [
    [1, 0],
    [1, 1],
    [1, 2],
  ];
  const y: Vec = [1, 2, 3]; // 完美在直线 y=1+x 上
  const residual = (x: Vec): Vec =>
    A.map((row) => row[0]! * x[0]! + row[1]! * x[1]! - y[A.indexOf(row)]!);
  const jacobian = (): Mat => A;
  const r = gaussNewton(residual, jacobian, [0, 0], { maxIter: 50, tol: 1e-12 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-4, `b=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 1e-4, `m=${r.x[1]}`);
});

test('opt-gauss-newton 指数拟合收敛到 a=2, b=0.5', () => {
  const r = gaussNewton(DEFAULT_INPUT.residual, DEFAULT_INPUT.jacobian, [1, 0.1], {
    maxIter: 50,
    tol: 1e-12,
  });
  assert.ok(Math.abs(r.x[0]! - 2) < 1e-3, `a=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 0.5) < 1e-3, `b=${r.x[1]}`);
});

test('opt-gauss-newton 成本下降', () => {
  let prev = Infinity;
  let decreased = false;
  const hooks: GaussNewtonHooks = {
    onIter: (_i, _x, cost) => {
      if (cost < prev) decreased = true;
      prev = cost;
    },
  };
  gaussNewton(
    DEFAULT_INPUT.residual,
    DEFAULT_INPUT.jacobian,
    [1, 0.1],
    { maxIter: 20, tol: 1e-14 },
    hooks,
  );
  assert.ok(decreased);
});

test('opt-gauss-newton 钩子', () => {
  let iters = 0;
  let results = 0;
  gaussNewton(
    DEFAULT_INPUT.residual,
    DEFAULT_INPUT.jacobian,
    [1, 0.1],
    { maxIter: 5, tol: 1e-14 },
    { onIter: () => iters++, onResult: () => results++ },
  );
  assert.ok(iters >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const a = last.aux!.find((e) => e.label === 'a');
  assert.ok(a);
});
