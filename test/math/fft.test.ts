import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fft,
  fftInPlace,
  dftNaive,
  cx,
  bitReverse,
  isPow2,
  type Complex,
} from '../../src/algorithms/math/fft/impl.ts';

const approx = (a: Complex, b: Complex, eps = 1e-6): boolean =>
  Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps;

test('fft 空输入', () => {
  assert.deepEqual(fft([]), []);
});

test('isPow2 / bitReverse 工具', () => {
  assert.equal(isPow2(1), true);
  assert.equal(isPow2(8), true);
  assert.equal(isPow2(6), false);
  assert.equal(bitReverse(0b011, 3), 0b110);
  assert.equal(bitReverse(0b101, 3), 0b101);
});

test('fft 自动补 0 到 2 的幂', () => {
  const out = fft([1, 2, 3]); // 补到 4
  assert.equal(out.length, 4);
  // X[0] = 1+2+3+0 = 6
  assert.ok(approx(out[0]!, cx.fromReal(6)));
});

test('fft 与朴素 DFT 一致', () => {
  const reals = [1, 2, 3, 4, 0, 0, 0, 0];
  const fast = fft(reals);
  const naive = dftNaive(reals);
  assert.equal(fast.length, naive.length);
  for (let k = 0; k < naive.length; k++) {
    assert.ok(approx(fast[k]!, naive[k]!), `X[${k}] mismatch`);
  }
});

test('fft 频域已知值：常数序列只有一个非零 DC 分量', () => {
  // [1,1,1,1] → X[0]=4, 其余 0
  const out = fft([1, 1, 1, 1]);
  assert.ok(approx(out[0]!, { re: 4, im: 0 }));
  for (let k = 1; k < 4; k++) assert.ok(approx(out[k]!, { re: 0, im: 0 }));
});

test('fft 频域已知值：单一余弦的冲激响应', () => {
  // [1,0,0,0] → X[k] = 1 对所有 k
  const out = fft([1, 0, 0, 0]);
  for (let k = 0; k < 4; k++) assert.ok(approx(out[k]!, { re: 1, im: 0 }));
});

test('fftInPlace 与 fft 一致', () => {
  const reals = [3, 1, 4, 1, 5, 9, 2, 6];
  const a1 = fft(reals);
  const a2 = fftInPlace(reals.map(cx.fromReal));
  assert.equal(a1.length, a2.length);
  for (let k = 0; k < a1.length; k++) assert.ok(approx(a1[k]!, a2[k]!));
});

test('fft → ifft 可逆（复原原序列）', () => {
  const reals = [1, 2, 3, 4, 0, 0, 0, 0];
  const spec = fft(reals);
  // 用同一数组做逆变换
  const back = fftInPlace(
    spec.map((z) => ({ ...z })),
    true,
  );
  for (let k = 0; k < reals.length; k++) {
    assert.ok(approx(back[k]!, cx.fromReal(reals[k]!)), `recover[${k}]`);
  }
});

test('非 2 的幂长度抛错', () => {
  assert.throws(() => fftInPlace([cx.fromReal(1), cx.fromReal(2), cx.fromReal(3)]), RangeError);
});

test('fft 钩子被调用', () => {
  let stages = 0;
  let butterflies = 0;
  let done = 0;
  fftInPlace([1, 2, 3, 4, 0, 0, 0, 0].map(cx.fromReal), false, {
    onStage: () => stages++,
    onButterfly: () => butterflies++,
    onDone: () => done++,
  });
  // n=8 → log2(8)=3 级；每级 n/2=4 个蝶形 → 共 12
  assert.equal(stages, 3);
  assert.equal(butterflies, 12);
  assert.equal(done, 1);
});
