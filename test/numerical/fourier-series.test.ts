import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fourierCoeffs,
  fourierEvaluate,
} from '../../src/algorithms/numerical/fourier-series/impl.ts';

const close = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) < eps;

test('fourierCoeffs: 余弦函数 cos(x) 在 [−π,π] 的 a1=1, 其余为 0', () => {
  const c = fourierCoeffs(Math.cos, Math.PI, 3, 2000);
  assert.ok(close(c.a0, 0, 1e-3));
  assert.ok(close(c.a[1]!, 1, 1e-3));
  assert.ok(close(c.b[1]!, 0, 1e-3));
});

test('fourierCoeffs: 正弦函数 sin(x) 的 b1=1', () => {
  const c = fourierCoeffs(Math.sin, Math.PI, 3, 2000);
  assert.ok(close(c.a0, 0, 1e-3));
  assert.ok(close(c.a[1]!, 0, 1e-3));
  assert.ok(close(c.b[1]!, 1, 1e-3));
});

test('fourierCoeffs: 常数函数 f=1 → a0=2, an=bn=0', () => {
  const c = fourierCoeffs(() => 1, Math.PI, 3, 2000);
  assert.ok(close(c.a0, 2, 1e-3));
  for (let n = 1; n <= 3; n++) {
    assert.ok(close(c.a[n]!, 0, 1e-3));
    assert.ok(close(c.b[n]!, 0, 1e-3));
  }
});

test('fourierCoeffs: 方波只有奇次谐波', () => {
  const f = (x: number): number => (x >= 0 ? 1 : -1);
  const c = fourierCoeffs(f, Math.PI, 5, 4000);
  // a0 应为 0（奇函数关于 0 对称的方波）
  assert.ok(close(c.a0, 0, 1e-2));
  // aₙ 全部接近 0
  for (let n = 1; n <= 5; n++) assert.ok(close(c.a[n]!, 0, 1e-2));
  // 偶次 bₙ ≈ 0，奇次 bₙ ≈ 4/(nπ)
  for (let n = 1; n <= 5; n++) {
    if (n % 2 === 1) {
      assert.ok(close(c.b[n]!, 4 / (n * Math.PI), 1e-2), `b${n}=${c.b[n]}`);
    } else {
      assert.ok(close(c.b[n]!, 0, 1e-2));
    }
  }
});

test('fourierEvaluate: 余弦函数在 0 处还原 = 1', () => {
  const c = fourierCoeffs(Math.cos, Math.PI, 5, 2000);
  assert.ok(close(fourierEvaluate(c, Math.PI, 0), 1, 1e-3));
});

test('fourierEvaluate: N=0 时退化为 a0/2', () => {
  const c = fourierCoeffs(() => 4, Math.PI, 0, 1000);
  // a0 = (1/π)∫4 = 8 → a0/2 = 4
  assert.ok(close(fourierEvaluate(c, Math.PI, 1.5), 4, 1e-2));
});

test('fourierCoeffs: hooks 正确回调', () => {
  const ns: number[] = [];
  let done: unknown = null;
  fourierCoeffs(Math.sin, Math.PI, 4, 500, {
    onCoeff: (n) => ns.push(n),
    onDone: (c) => (done = c),
  });
  assert.deepEqual(ns, [1, 2, 3, 4]);
  assert.ok(done !== null);
});

test('fourierCoeffs: 非法入参抛错', () => {
  assert.throws(() => fourierCoeffs(Math.sin, 0, 3), RangeError);
  assert.throws(() => fourierCoeffs(Math.sin, Math.PI, -1), RangeError);
});
