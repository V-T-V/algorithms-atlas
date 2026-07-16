import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  admm,
  softThreshold,
} from '../../src/algorithms/optimization/opt-alternating-direction/impl.ts';

// Lasso: min (1/2)‖x-t‖² + λ‖x‖₁, 一致性 ADMM 形式
test('admm: Lasso 1D 收敛到软阈值闭式解', () => {
  // 1D: t=3, λ=1
  // 闭式解：sign(3)·max(|3|-1, 0) = 2
  const t = [3];
  const lambda = 1;
  const rho = 1;
  const proxF = (v: number[], _r: number): number[] =>
    v.map((vi, i) => (_r * vi + t[i]!) / (_r + 1));
  const proxG = (v: number[], r: number): number[] =>
    v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - lambda / r, 0));
  const r = admm(proxF, proxG, [0], { rho, maxIter: 300 });
  assert.ok(Math.abs(r.x[0]! - 2) < 0.05, `x=${r.x[0]}`);
});

test('admm: 一致性约束满足（primal 残差很小）', () => {
  const t = [3, -2, 1, 5, -4];
  const lambda = 1;
  const rho = 1;
  const proxF = (v: number[], _r: number): number[] =>
    v.map((vi, i) => (_r * vi + t[i]!) / (_r + 1));
  const proxG = (v: number[], r: number): number[] =>
    v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - lambda / r, 0));
  const r = admm(proxF, proxG, [0, 0, 0, 0, 0], { rho, maxIter: 300 });
  assert.ok(r.primalRes < 1e-2, `primalRes=${r.primalRes}`);
});

test('admm: x 与 z 应在收敛时一致', () => {
  const t = [4, -3];
  const lambda = 0.5;
  const rho = 2;
  const proxF = (v: number[], _r: number): number[] =>
    v.map((vi, i) => (_r * vi + t[i]!) / (_r + 1));
  const proxG = (v: number[], r: number): number[] =>
    v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - lambda / r, 0));
  const r = admm(proxF, proxG, [0, 0], { rho, maxIter: 300 });
  for (let i = 0; i < r.x.length; i++) {
    assert.ok(Math.abs(r.x[i]! - r.z[i]!) < 1e-2, `x[${i}]=${r.x[i]}, z[${i}]=${r.z[i]}`);
  }
});

test('admm: softThreshold 与解析公式一致', () => {
  const v = [2, -3, 0.5, -0.5, 0];
  const rho = 1;
  const st = softThreshold(v, rho);
  // 期望 sign(v)·max(|v|-1, 0)
  const expected = [1, -2, 0, 0, 0];
  for (let i = 0; i < v.length; i++) {
    assert.ok(Math.abs(st[i]! - expected[i]!) < 1e-9, `st[${i}]=${st[i]}`);
  }
});

test('admm: 迭代次数 > 0', () => {
  const t = [1];
  const proxF = (v: number[], _r: number): number[] =>
    v.map((vi, i) => (_r * vi + t[i]!) / (_r + 1));
  const proxG = (v: number[], r: number): number[] =>
    v.map((x) => Math.sign(x) * Math.max(Math.abs(x) - 1 / r, 0));
  const r = admm(proxF, proxG, [0], { maxIter: 50 });
  assert.ok(r.iterations > 0);
});
