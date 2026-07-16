import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sr1,
  sr1Update,
  type SR1Hooks,
  type Mat,
} from '../../src/algorithms/optimization/opt-sr1/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-sr1/trace.ts';

const f = (x: number[]): number => (x[0]! - 2) ** 2 + (x[1]! - 4) ** 2;
const g = (x: number[]): number[] => [2 * (x[0]! - 2), 2 * (x[1]! - 4)];

test('opt-sr1 二次函数收敛', () => {
  const r = sr1(f, g, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.ok(Math.abs(r.x[0]! - 2) < 1e-3, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 4) < 1e-3, `y=${r.x[1]}`);
});

test('opt-sr1 sr1Update 对二次问题精确', () => {
  // H=I, s=[1,0], y=[2,0]；v=s-Hy=[1,0]-[2,0]=[-1,0]；vᵀy=-2
  // H += v vᵀ / vᵀy = [[1,0],[0,1]] + [[1,0],[0,0]]/(-2) = [[0.5,0],[0,1]]
  const H: Mat = [
    [1, 0],
    [0, 1],
  ];
  const updated = sr1Update(H, [1, 0], [2, 0]);
  assert.equal(updated, true);
  assert.ok(Math.abs(H[0]![0]! - 0.5) < 1e-9);
  assert.ok(Math.abs(H[1]![1]! - 1) < 1e-9);
});

test('opt-sr1 sr1Update 跳过退化情形', () => {
  const H: Mat = [
    [1, 0],
    [0, 1],
  ];
  // s=[1,0], y=[0,1] → v=s-Hy=[1,-1], vᵀy=-1 不退化 → 更新
  // s=[0,0], y=[0,0] → v=[0,0], vᵀy=0 → 跳过
  const updated = sr1Update(H, [0, 0], [0, 0]);
  assert.equal(updated, false);
});

test('opt-sr1 收敛标志', () => {
  const r = sr1(f, g, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.equal(r.converged, true);
});

test('opt-sr1 值下降', () => {
  let prev = Infinity;
  let decreased = false;
  sr1(
    f,
    g,
    [0, 0],
    { maxIter: 10, tol: 1e-14 },
    {
      onIter: (_i, _x, _g, value) => {
        if (value < prev) decreased = true;
        prev = value;
      },
    },
  );
  assert.ok(decreased);
});

test('opt-sr1 钩子', () => {
  let iters = 0;
  let updates = 0;
  let results = 0;
  const hooks: SR1Hooks = {
    onIter: () => iters++,
    onUpdate: () => updates++,
    onResult: () => results++,
  };
  sr1(f, g, [0, 0], { maxIter: 5, tol: 1e-14 }, hooks);
  assert.ok(iters >= 1);
  assert.ok(updates >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
