import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bluesteinDFT,
  type Complex,
} from '../../src/algorithms/numerical/num-fft-bluestein/impl.ts';
import { fft } from '../../src/algorithms/numerical/num-fft-cooley-tukey/impl.ts';

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

test('Bluestein 与朴素 DFT 一致（长度 5）', () => {
  const x: Complex[] = [1, 2, 3, 4, 5].map((v) => ({ re: v, im: 0 }));
  const fast = bluesteinDFT(x);
  const naive = naiveDFT(x);
  for (let k = 0; k < 5; k++) {
    assert.ok(Math.abs(fast[k]!.re - naive[k]!.re) < 1e-6, `re k=${k}`);
    assert.ok(Math.abs(fast[k]!.im - naive[k]!.im) < 1e-6, `im k=${k}`);
  }
});

test('Bluestein 长度 7', () => {
  const x: Complex[] = [0, 1, 0, 1, 0, 1, 0].map((v) => ({ re: v, im: 0 }));
  const fast = bluesteinDFT(x);
  const naive = naiveDFT(x);
  for (let k = 0; k < 7; k++) {
    assert.ok(Math.abs(fast[k]!.re - naive[k]!.re) < 1e-6);
  }
});

test('Bluestein 与 Cooley-Tukey 一致（长度 8 = 2 的幂）', () => {
  const x: Complex[] = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({ re: v, im: 0 }));
  const bs = bluesteinDFT(x);
  const ct = fft(x);
  for (let k = 0; k < 8; k++) {
    assert.ok(Math.abs(bs[k]!.re - ct[k]!.re) < 1e-6);
    assert.ok(Math.abs(bs[k]!.im - ct[k]!.im) < 1e-6);
  }
});

test('Bluestein 逆变换恢复原信号', () => {
  const x: Complex[] = [1, 2, 3, 4, 5, 6, 7].map((v) => ({ re: v, im: 0 }));
  const X = bluesteinDFT(x);
  const inv = bluesteinDFT(X, true);
  for (let n = 0; n < 7; n++) {
    assert.ok(Math.abs(inv[n]!.re - x[n]!.re) < 1e-6);
  }
});

test('Bluestein 单位冲激', () => {
  const x: Complex[] = [1, 0, 0, 0, 0].map((v) => ({ re: v, im: 0 }));
  const X = bluesteinDFT(x);
  for (let k = 0; k < 5; k++) {
    assert.ok(Math.abs(X[k]!.re - 1) < 1e-9);
  }
});

test('Bluestein 长度 1', () => {
  const X = bluesteinDFT([{ re: 5, im: 0 }]);
  assert.ok(Math.abs(X[0]!.re - 5) < 1e-9);
});
