import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  taylorSeries,
  maclaurinSeries,
} from '../../src/algorithms/numerical/taylor-series/impl.ts';

const close = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) < eps;

test('taylorSeries: e^x 在 0 处（8 项）≈ e', () => {
  // 各阶导在 0 处都是 1
  const d = [1, 1, 1, 1, 1, 1, 1, 1];
  assert.ok(close(taylorSeries(d, 1, 0), Math.E, 1e-4));
});

test('taylorSeries: sin(x) 在 0 处', () => {
  // sin 在 0 处导数：0,1,0,-1,0,1,0,-1,...
  const d = [0, 1, 0, -1, 0, 1, 0, -1, 0, 1];
  assert.ok(close(taylorSeries(d, 0.5, 0), Math.sin(0.5)));
});

test('taylorSeries: cos(x) 在 0 处', () => {
  // cos 在 0 处导数：1,0,-1,0,1,0,-1,...
  const d = [1, 0, -1, 0, 1, 0, -1, 0, 1];
  assert.ok(close(taylorSeries(d, 0.7, 0), Math.cos(0.7)));
});

test('taylorSeries: ln(1+x) 在 0 处', () => {
  // 导数：0, 1, -1, 2, -6, 24, ...（f⁽ᵏ⁾ = (-1)^(k-1)·(k-1)!）
  const d = [0, 1, -1, 2, -6, 24, -120, 720];
  assert.ok(close(taylorSeries(d, 0.3, 0), Math.log(1.3), 1e-5));
});

test('taylorSeries: 在非零点 a 展开', () => {
  // f(x) = (x-1)^2 + 2，在 a=1 处：f(1)=2, f'(1)=0, f''(1)=2
  // T(x) = 2 + 0·(x-1) + (2/2)·(x-1)² = 2 + (x-1)²
  const d = [2, 0, 2];
  assert.ok(close(taylorSeries(d, 3, 1), 2 + (3 - 1) ** 2));
});

test('maclaurinSeries: 是 a=0 的特例', () => {
  const d = [1, 1, 1, 1, 1, 1];
  assert.ok(close(maclaurinSeries(d, 1), taylorSeries(d, 1, 0)));
});

test('taylorSeries: 项数越多越精确（e^x 在 0）', () => {
  const x = 2;
  const trueVal = Math.exp(x);
  const err3 = Math.abs(taylorSeries([1, 1, 1, 1], x, 0) - trueVal);
  const err10 = Math.abs(taylorSeries(Array(10).fill(1), x, 0) - trueVal);
  assert.ok(err10 < err3);
});

test('taylorSeries: hooks 正确回调', () => {
  const terms: number[] = [];
  let done: number | null = null;
  taylorSeries([1, 1, 1], 1, 0, {
    onTerm: (k, _t, sum) => terms.push(sum),
    onDone: (r) => (done = r),
  });
  assert.equal(terms.length, 3);
  assert.ok(done !== null);
});

test('taylorSeries: 空导数列表抛错', () => {
  assert.throws(() => taylorSeries([], 1, 0), RangeError);
});
