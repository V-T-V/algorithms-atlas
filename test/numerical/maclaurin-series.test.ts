import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maclaurinSeries } from '../../src/algorithms/numerical/maclaurin-series/impl.ts';

const close = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;

test('maclaurinSeries: e^x（6 项）', () => {
  const approx = maclaurinSeries(Math.exp, 0.5, 6);
  assert.ok(close(approx, Math.exp(0.5), 1e-3));
});

test('maclaurinSeries: sin(x)（5 项，h=1e-2 抑制高阶数值噪声）', () => {
  // 高阶数值导数误差累积，故取 5 项 + 较大步长 h=1e-2
  const approx = maclaurinSeries(Math.sin, 0.6, 5, 1e-2);
  assert.ok(close(approx, Math.sin(0.6), 1e-3));
});

test('maclaurinSeries: cos(x)（6 项）', () => {
  const approx = maclaurinSeries(Math.cos, 0.5, 6);
  assert.ok(close(approx, Math.cos(0.5), 1e-3));
});

test('maclaurinSeries: n=0 退化为 f(0)', () => {
  const approx = maclaurinSeries(Math.cos, 5, 0);
  assert.ok(close(approx, Math.cos(0), 1e-6));
});

test('maclaurinSeries: 多项式函数可精确还原', () => {
  // f(x) = 3 + 2x + x² → 在 0 处导数 3,2,2,0,0,...
  const f = (x: number): number => 3 + 2 * x + x * x;
  const approx = maclaurinSeries(f, 1.5, 4, 1e-3);
  assert.ok(close(approx, f(1.5), 1e-2));
});

test('maclaurinSeries: hooks 正确回调', () => {
  const derivs: number[] = [];
  let done: number | null = null;
  maclaurinSeries(Math.exp, 1, 3, 1e-3, {
    onDerivative: (_k, v) => derivs.push(v),
    onDone: (r) => (done = r),
  });
  assert.equal(derivs.length, 4);
  assert.ok(done !== null);
});

test('maclaurinSeries: 非法入参抛错', () => {
  assert.throws(() => maclaurinSeries(Math.exp, 1, -1), RangeError);
  assert.throws(() => maclaurinSeries(Math.exp, 1, 3, 0), RangeError);
  assert.throws(() => maclaurinSeries(Math.exp, 1, 3, -1), RangeError);
});
