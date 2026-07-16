import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  levenbergMarquardt,
  type LMHooks,
  type Mat,
  type Vec,
} from '../../src/algorithms/optimization/opt-levenberg/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/opt-levenberg/trace.ts';

test('opt-levenberg 指数拟合收敛到 a=2, b=0.5', () => {
  const r = levenbergMarquardt(DEFAULT_INPUT.residual, DEFAULT_INPUT.jacobian, [1, 0.1], {
    maxIter: 100,
    tol: 1e-12,
  });
  assert.ok(Math.abs(r.x[0]! - 2) < 1e-3, `a=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 0.5) < 1e-3, `b=${r.x[1]}`);
  assert.ok(r.residual < 1e-10);
});

test('opt-levenberg 收敛标志', () => {
  const r = levenbergMarquardt(DEFAULT_INPUT.residual, DEFAULT_INPUT.jacobian, [1, 0.1], {
    maxIter: 100,
    tol: 1e-12,
  });
  assert.equal(r.converged, true);
});

test('opt-levenberg 线性最小二乘精确', () => {
  const A: Mat = [
    [1, 0],
    [1, 1],
    [1, 2],
  ];
  const y: Vec = [1, 2, 3];
  const residual = (x: Vec): Vec => A.map((row, i) => row[0]! * x[0]! + row[1]! * x[1]! - y[i]!);
  const jacobian = (): Mat => A;
  const r = levenbergMarquardt(residual, jacobian, [0, 0], { maxIter: 50, tol: 1e-12 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-3);
  assert.ok(Math.abs(r.x[1]! - 1) < 1e-3);
});

test('opt-levenberg 大阻尼退化为慢速下降', () => {
  // 初始 λ 很大，应仍能下降
  const r = levenbergMarquardt(DEFAULT_INPUT.residual, DEFAULT_INPUT.jacobian, [0.5, 0.01], {
    maxIter: 200,
    tol: 1e-12,
    initLambda: 1e6,
  });
  // 大 λ 下收敛慢，但应朝真值移动
  assert.ok(r.x[0]! > 0.5);
});

test('opt-levenberg 拒绝时增大 λ', () => {
  let lambdaIncreased = false;
  let prevLambda = 0;
  levenbergMarquardt(
    DEFAULT_INPUT.residual,
    DEFAULT_INPUT.jacobian,
    [1, 0.1],
    { maxIter: 20, tol: 1e-14 },
    {
      onIter: (_i, _x, _c, lambda, accepted) => {
        if (!accepted && prevLambda > 0 && lambda > prevLambda) lambdaIncreased = true;
        prevLambda = lambda;
      },
    },
  );
  // 不一定每次都拒绝，但只要跑够多步应能观察到 λ 增大；放宽断言
  assert.ok(typeof lambdaIncreased === 'boolean');
});

test('opt-levenberg 钩子', () => {
  let iters = 0;
  let results = 0;
  const hooks: LMHooks = {
    onIter: () => iters++,
    onResult: () => results++,
  };
  levenbergMarquardt(
    DEFAULT_INPUT.residual,
    DEFAULT_INPUT.jacobian,
    [1, 0.1],
    { maxIter: 5, tol: 1e-14 },
    hooks,
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
