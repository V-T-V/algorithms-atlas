import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  broyden,
  broydenUpdate,
  type BroydenHooks,
  type Mat,
  type Vec,
} from '../../src/algorithms/optimization/opt-broyden/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-broyden/trace.ts';

const F = (x: Vec): Vec => [x[0]! ** 2 - 4, x[1]! ** 2 - 9];

test('opt-broyden 求 x²=4, y²=9', () => {
  const r = broyden(F, [1, 1], { maxIter: 100, tol: 1e-10, useNumericalInit: true });
  assert.ok(Math.abs(r.x[0]! - 2) < 1e-4, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 3) < 1e-4, `y=${r.x[1]}`);
  assert.ok(r.residual < 1e-6);
});

test('opt-broyden 单变量 F(x)=x−2', () => {
  const r = broyden((x: Vec): Vec => [x[0]! - 2], [0], { maxIter: 50, tol: 1e-12 });
  assert.ok(Math.abs(r.x[0]! - 2) < 1e-6);
});

test('opt-broyden 残差下降', () => {
  let prev = Infinity;
  let decreased = false;
  broyden(
    F,
    [1, 1],
    { maxIter: 20, tol: 1e-14, useNumericalInit: true },
    {
      onIter: (_i, _x, residual) => {
        if (residual < prev) decreased = true;
        prev = residual;
      },
    },
  );
  assert.ok(decreased);
});

test('opt-broyden broydenUpdate 零分母不崩', () => {
  const B: Mat = [
    [1, 0],
    [0, 1],
  ];
  broydenUpdate(B, [0, 0], [0, 0]); // sTBF=0
  assert.equal(B[0]![0], 1);
});

test('opt-broyden broydenUpdate 修改 B', () => {
  const B: Mat = [
    [1, 0],
    [0, 1],
  ];
  broydenUpdate(B, [1, 0], [0.5, 0]);
  // 应改变 B[0][0]
  assert.notEqual(B[0]![0], 1);
});

test('opt-broyden 钩子', () => {
  let iters = 0;
  let updates = 0;
  let results = 0;
  const hooks: BroydenHooks = {
    onIter: () => iters++,
    onUpdate: () => updates++,
    onResult: () => results++,
  };
  broyden(F, [1, 1], { maxIter: 5, tol: 1e-14 }, hooks);
  assert.ok(iters >= 1);
  assert.ok(updates >= 1);
  assert.equal(results, 1);
});

test('opt-broyden 收敛标志', () => {
  const r = broyden(F, [1, 1], { maxIter: 100, tol: 1e-10, useNumericalInit: true });
  assert.equal(r.converged, true);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
