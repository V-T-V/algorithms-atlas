import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfp, dfpUpdate, type DFPHooks } from '../../src/algorithms/optimization/opt-dfp/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-dfp/trace.ts';

const f = (x: number[]): number => (x[0]! - 3) ** 2 + (x[1]! + 1) ** 2;
const g = (x: number[]): number[] => [2 * (x[0]! - 3), 2 * (x[1]! + 1)];

test('opt-dfp 二次函数收敛到 (3,-1)', () => {
  const r = dfp(f, g, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.ok(Math.abs(r.x[0]! - 3) < 1e-4, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! + 1) < 1e-4, `y=${r.x[1]}`);
});

test('opt-dfp 收敛标志', () => {
  const r = dfp(f, g, [0, 0], { maxIter: 100, tol: 1e-10 });
  assert.equal(r.converged, true);
});

test('opt-dfp 值下降', () => {
  let prev = Infinity;
  let decreased = false;
  dfp(
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

test('opt-dfp dfpUpdate 在二次问题上得单位阵外更新', () => {
  // H=I, s=[1,0], y=[2,0]（海森=2I 的梯度差）
  // 更新后 H 应接近 (1/2)I 的 0,0 元
  const H = [
    [1, 0],
    [0, 1],
  ];
  dfpUpdate(H, [1, 0], [2, 0]);
  // DFP 对二次问题应给出精确海森逆 = 0.5 I
  assert.ok(Math.abs(H[0]![0]! - 0.5) < 1e-9, `H00=${H[0]![0]}`);
  assert.ok(Math.abs(H[1]![1]! - 1) < 1e-9); // y 只影响第 0 行
});

test('opt-dfp dfpUpdate 零分母不崩', () => {
  const H = [
    [1, 0],
    [0, 1],
  ];
  dfpUpdate(H, [0, 0], [0, 0]); // ys=0 → 不更新
  assert.equal(H[0]![0], 1);
});

test('opt-dfp 钩子', () => {
  let iters = 0;
  let updates = 0;
  let results = 0;
  const hooks: DFPHooks = {
    onIter: () => iters++,
    onUpdate: () => updates++,
    onResult: () => results++,
  };
  dfp(f, g, [0, 0], { maxIter: 5, tol: 1e-14 }, hooks);
  assert.ok(iters >= 1);
  assert.ok(updates >= 1);
  assert.equal(results, 1);
});

test('opt-dfp 高维收敛', () => {
  const n = 4;
  const t = [1, 2, 3, 4];
  const fN = (x: number[]): number => x.reduce((s, v, i) => s + (v - t[i]!) ** 2, 0);
  const gN = (x: number[]): number[] => x.map((v, i) => 2 * (v - t[i]!));
  const r = dfp(fN, gN, [0, 0, 0, 0], { maxIter: 100, tol: 1e-10 });
  for (let i = 0; i < n; i++) assert.ok(Math.abs(r.x[i]! - t[i]!) < 1e-3);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
