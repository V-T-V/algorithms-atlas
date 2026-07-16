import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dft, toComplex, cAbs, type Complex } from '../../src/algorithms/numerical/dft/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;
const cEq = (a: Complex, b: Complex, eps = 1e-9): boolean =>
  close(a.re, b.re, eps) && close(a.im, b.im, eps);

test('dft: 单脉冲（[1,0,0,0]）→ 全 1', () => {
  const out = dft(toComplex([1, 0, 0, 0]));
  assert.equal(out.length, 4);
  for (const c of out) assert.ok(cEq(c, { re: 1, im: 0 }));
});

test('dft: 常数序列 [c,c,c,c] → 只有 X0 非 0', () => {
  const out = dft(toComplex([2, 2, 2, 2]));
  assert.ok(cEq(out[0]!, { re: 8, im: 0 }));
  for (let k = 1; k < 4; k++) assert.ok(cEq(out[k]!, { re: 0, im: 0 }));
});

test('dft: 单频率正弦的频谱集中在对应 bin', () => {
  // N=8, 1 个完整周期的余弦 → 能量集中在 X1 与 X7
  const N = 8;
  const real: number[] = [];
  for (let n = 0; n < N; n++) real.push(Math.cos((2 * Math.PI * 1 * n) / N));
  const out = dft(toComplex(real));
  // X0 ≈ 0
  assert.ok(close(cAbs(out[0]!), 0, 1e-9));
  // X1 与 X7 幅度 = N/2
  assert.ok(close(cAbs(out[1]!), N / 2, 1e-9));
  assert.ok(close(cAbs(out[7]!), N / 2, 1e-9));
});

test('dft: 输出长度 = 输入长度', () => {
  assert.equal(dft(toComplex([1, 2, 3])).length, 3);
  assert.equal(dft(toComplex([1])).length, 1);
});

test('dft: 空数组', () => {
  assert.deepEqual(dft([]), []);
});

test('dft: hooks 正确回调', () => {
  const ks: number[] = [];
  let done: unknown = null;
  dft(toComplex([1, 0, 1, 0]), {
    onBin: (k) => ks.push(k),
    onDone: (s) => (done = s),
  });
  assert.deepEqual(ks, [0, 1, 2, 3]);
  assert.ok(done !== null);
});

test('toComplex: 实数转复数虚部为 0', () => {
  const c = toComplex([1, 2, 3]);
  assert.equal(c[1]!.im, 0);
  assert.equal(c[1]!.re, 2);
});

test('cAbs: 复数模', () => {
  assert.ok(close(cAbs({ re: 3, im: 4 }), 5));
  assert.ok(close(cAbs({ re: 0, im: 0 }), 0));
});
