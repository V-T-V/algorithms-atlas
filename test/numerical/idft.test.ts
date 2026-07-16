import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dft, toComplex } from '../../src/algorithms/numerical/dft/impl.ts';
import { idft, type Complex } from '../../src/algorithms/numerical/idft/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;
const cEq = (a: Complex, b: Complex, eps = 1e-9): boolean =>
  close(a.re, b.re, eps) && close(a.im, b.im, eps);

test('idft: DFT 的逆（实信号还原）', () => {
  const orig = [1, 2, 3, 4, 0, -1, -2, 3];
  const spec = dft(toComplex(orig));
  const recon = idft(spec);
  assert.equal(recon.length, orig.length);
  for (let i = 0; i < orig.length; i++) {
    assert.ok(close(recon[i]!.re, orig[i]!, 1e-9), `recon[${i}].re = ${recon[i]!.re}`);
    assert.ok(close(recon[i]!.im, 0, 1e-9));
  }
});

test('idft: DFT 的逆（复信号）', () => {
  const orig: Complex[] = [
    { re: 1, im: 1 },
    { re: 2, im: -1 },
    { re: 0, im: 3 },
    { re: -1, im: 0 },
  ];
  const recon = idft(dft(orig));
  for (let i = 0; i < orig.length; i++) {
    assert.ok(cEq(recon[i]!, orig[i]!, 1e-9));
  }
});

test('idft: 单频分量还原对应正弦', () => {
  // 频域只有 X1=N/2, X_{N-1}=N/2（实余弦）→ 时域 = cos(2πn/N)
  const N = 8;
  const spec: Complex[] = Array.from({ length: N }, () => ({ re: 0, im: 0 }));
  spec[1] = { re: N / 2, im: 0 };
  spec[N - 1] = { re: N / 2, im: 0 };
  const recon = idft(spec);
  for (let n = 0; n < N; n++) {
    assert.ok(close(recon[n]!.re, Math.cos((2 * Math.PI * n) / N), 1e-9));
  }
});

test('idft: 常数频谱（仅 X0=N·c）→ 时域常数 c', () => {
  const N = 4;
  const c = 3;
  const spec: Complex[] = Array.from({ length: N }, () => ({ re: 0, im: 0 }));
  spec[0] = { re: N * c, im: 0 };
  const recon = idft(spec);
  for (let n = 0; n < N; n++) assert.ok(close(recon[n]!.re, c, 1e-9));
});

test('idft: 空数组', () => {
  assert.deepEqual(idft([]), []);
});

test('idft: hooks 正确回调', () => {
  const ns: number[] = [];
  let done: unknown = null;
  idft(toComplex([1, 0, 1, 0]), {
    onSample: (n) => ns.push(n),
    onDone: (s) => (done = s),
  });
  assert.deepEqual(ns, [0, 1, 2, 3]);
  assert.ok(done !== null);
});
