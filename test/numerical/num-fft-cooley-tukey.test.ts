import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fft,
  fftReal,
  cAdd,
  cMul,
  type Complex,
} from '../../src/algorithms/numerical/num-fft-cooley-tukey/impl.ts';

function naiveDFT(input: Complex[], inverse = false): Complex[] {
  const N = input.length;
  const out: Complex[] = [];
  const sign = inverse ? 1 : -1;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const ang = (sign * 2 * Math.PI * k * n) / N;
      re += input[n]!.re * Math.cos(ang) - input[n]!.im * Math.sin(ang);
      im += input[n]!.re * Math.sin(ang) + input[n]!.im * Math.cos(ang);
    }
    if (inverse) {
      re /= N;
      im /= N;
    }
    out.push({ re, im });
  }
  return out;
}

test('FFT 与朴素 DFT 一致', () => {
  const x: Complex[] = [1, 2, 3, 4, 0, 0, 1, 2].map((v) => ({ re: v, im: 0 }));
  const fast = fft(x);
  const naive = naiveDFT(x);
  for (let k = 0; k < x.length; k++) {
    assert.ok(Math.abs(fast[k]!.re - naive[k]!.re) < 1e-6);
    assert.ok(Math.abs(fast[k]!.im - naive[k]!.im) < 1e-6);
  }
});

test('FFT 单位冲激', () => {
  // δ(n) 的 DFT 是全 1
  const x: Complex[] = [1, 0, 0, 0, 0, 0, 0, 0].map((v) => ({ re: v, im: 0 }));
  const X = fft(x);
  for (let k = 0; k < 8; k++) {
    assert.ok(Math.abs(X[k]!.re - 1) < 1e-9);
    assert.ok(Math.abs(X[k]!.im) < 1e-9);
  }
});

test('FFT 逆变换恢复原信号', () => {
  const x: Complex[] = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({ re: v, im: 0 }));
  const X = fft(x);
  const inv = fft(X, true);
  for (let n = 0; n < x.length; n++) {
    assert.ok(Math.abs(inv[n]!.re - x[n]!.re) < 1e-9);
  }
});

test('FFT 正弦信号', () => {
  // 频率 1 的 8 点正弦信号应集中能量在 k=1 和 k=7
  const N = 8;
  const x: Complex[] = [];
  for (let n = 0; n < N; n++) x.push({ re: Math.sin((2 * Math.PI * n) / N), im: 0 });
  const X = fft(x);
  const mags = X.map((c) => Math.hypot(c.re, c.im));
  // k=1 和 k=7 的幅度最大且相等
  assert.ok(mags[1]! > 3 && mags[7]! > 3);
  assert.ok(Math.abs(mags[1]! - mags[7]!) < 1e-9);
});

test('FFT 非法长度抛错', () => {
  assert.throws(
    () =>
      fft([
        { re: 1, im: 0 },
        { re: 2, im: 0 },
        { re: 3, im: 0 },
      ]),
    RangeError,
  );
});

test('fftReal 自动补零', () => {
  const X = fftReal([1, 2, 3]);
  // 应补到 4 点
  assert.equal(X.length, 4);
});

test('复数运算', () => {
  const r = cMul({ re: 1, im: 1 }, { re: 1, im: 1 });
  // (1+i)² = 2i
  assert.ok(Math.abs(r.re) < 1e-9);
  assert.ok(Math.abs(r.im - 2) < 1e-9);
  void cAdd;
});
