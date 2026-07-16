import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ntt,
  nttInPlace,
  nttNaive,
  polyMultiply,
  powMod,
  invMod,
  bitReverse,
  isPow2,
  NTT_MOD,
  NTT_G,
} from '../../src/algorithms/math/ntt/impl.ts';

test('ntt 空输入', () => {
  assert.deepEqual(ntt([]), []);
});

test('isPow2 / bitReverse 工具', () => {
  assert.equal(isPow2(1), true);
  assert.equal(isPow2(8), true);
  assert.equal(isPow2(6), false);
  assert.equal(bitReverse(0b011, 3), 0b110);
  assert.equal(bitReverse(0b101, 3), 0b101);
});

test('ntt 自动补 0 到 2 的幂', () => {
  const out = ntt([1, 2, 3]); // 补到 4
  assert.equal(out.length, 4);
  // X[0] = 1+2+3+0 = 6
  assert.equal(out[0], 6n);
});

test('ntt 与朴素数论变换一致', () => {
  const reals = [1, 2, 3, 4, 0, 0, 0, 0];
  const fast = ntt(reals);
  const naive = nttNaive(reals);
  assert.equal(fast.length, naive.length);
  for (let k = 0; k < naive.length; k++) {
    assert.equal(fast[k], naive[k], `X[${k}] mismatch`);
  }
});

test('ntt 常数序列：仅 DC 分量非零', () => {
  // [1,1,1,1] → X[0]=4, 其余 0
  const out = ntt([1, 1, 1, 1]);
  assert.equal(out[0], 4n);
  for (let k = 1; k < 4; k++) assert.equal(out[k], 0n);
});

test('ntt 单位冲激：X[k]=1 对所有 k', () => {
  const out = ntt([1, 0, 0, 0]);
  for (let k = 0; k < 4; k++) assert.equal(out[k], 1n);
});

test('nttInPlace 与 ntt 一致', () => {
  const reals = [3, 1, 4, 1, 5, 9, 2, 6];
  const a1 = ntt(reals);
  const a2 = nttInPlace(reals.map((x) => BigInt(x)));
  assert.equal(a1.length, a2.length);
  for (let k = 0; k < a1.length; k++) assert.equal(a1[k], a2[k]);
});

test('ntt → intt 可逆', () => {
  const reals = [1, 2, 3, 4, 0, 0, 0, 0];
  const spec = ntt(reals);
  const back = nttInPlace(
    spec.map((z) => z),
    true,
  );
  for (let k = 0; k < reals.length; k++) {
    assert.equal(back[k], BigInt(reals[k]!), `recover[${k}]`);
  }
});

test('ntt 与 FFT 同构：与朴素 DFT 实部相符（小值）', () => {
  // 对小值输入，NTT 模 p 下结果应等于朴素 DFT 的实部（当实部 < p/2 时）
  const reals = [1, 1, 0, 0];
  const out = ntt(reals);
  // 朴素 DFT: X = [2, 1+i, 0, 1-i]，实部分别 2,1,0,1
  assert.equal(out[0], 2n);
  assert.equal(out[2], 0n);
  // X[1] 与 X[3] 实部为 1，虚部 ±1 在 NTT 里体现为 p-1 与 1（取决于约定）
  // 这里只检查 X[1]+X[3] = 2（实部翻倍，虚部相消）
  assert.equal((out[1]! + out[3]!) % NTT_MOD, 2n);
});

test('polyMultiply 多项式乘法正确', () => {
  // (1 + x) · (1 + x) = 1 + 2x + x^2
  const c = polyMultiply([1, 1], [1, 1]).map((x) => Number(x));
  assert.deepEqual(c, [1, 2, 1]);
  // (1 + 2x + x^2) · (1 + x) = 1 + 3x + 3x^2 + x^3
  const c2 = polyMultiply([1, 2, 1], [1, 1]).map((x) => Number(x));
  assert.deepEqual(c2, [1, 3, 3, 1]);
  // (1+x+x^2)·(1+x+x^2) = 1+2x+3x^2+2x^3+x^4
  const c3 = polyMultiply([1, 1, 1], [1, 1, 1]).map((x) => Number(x));
  assert.deepEqual(c3, [1, 2, 3, 2, 1]);
});

test('polyMultiply 与朴素卷积一致（含取模情形）', () => {
  const A = [5, 7, 2, 9, 1];
  const B = [3, 8, 4];
  const fast = polyMultiply(A, B).map((x) => Number(x));
  const naive: number[] = new Array(A.length + B.length - 1).fill(0);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      naive[i + j] = (naive[i + j]! + A[i]! * B[j]!) % Number(NTT_MOD);
    }
  }
  assert.deepEqual(fast, naive);
});

test('powMod / invMod 工具', () => {
  assert.equal(powMod(2n, 10n, NTT_MOD), 1024n);
  assert.equal(powMod(3n, 0n, NTT_MOD), 1n);
  // 3 是 998244353 的原根 → 3^(p-1) ≡ 1
  assert.equal(powMod(NTT_G, NTT_MOD - 1n, NTT_MOD), 1n);
  // invMod(2) · 2 ≡ 1
  assert.equal((invMod(2n, NTT_MOD) * 2n) % NTT_MOD, 1n);
});

test('非 2 的幂长度抛错', () => {
  assert.throws(() => nttInPlace([1n, 2n, 3n]), RangeError);
});

test('ntt 钩子被调用', () => {
  let stages = 0;
  let butterflies = 0;
  let done = 0;
  nttInPlace([1n, 2n, 3n, 4n, 0n, 0n, 0n, 0n], false, {
    onStage: () => stages++,
    onButterfly: () => butterflies++,
    onDone: () => done++,
  });
  // n=8 → 3 级；每级 4 个蝶形 → 12
  assert.equal(stages, 3);
  assert.equal(butterflies, 12);
  assert.equal(done, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/math/ntt/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
});
