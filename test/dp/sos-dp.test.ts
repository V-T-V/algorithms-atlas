import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sosDp } from '../../src/algorithms/dp/sos-dp/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/sos-dp/trace.ts';

const bruteSubsum = (a: number[], mask: number): number => {
  let s = 0;
  for (let sub = mask; ; sub = (sub - 1) & mask) {
    s += a[sub]!;
    if (sub === 0) break;
  }
  return s;
};

test('sos-dp 与暴力一致', () => {
  const a = [3, 1, 4, 1, 5, 9, 2, 6];
  const f = sosDp(a);
  for (let m = 0; m < 8; m++) assert.equal(f[m], bruteSubsum(a, m));
});

test('sos-dp 全 1 时 f[all]=2^n', () => {
  const a = [1, 1, 1, 1]; // n=2
  const f = sosDp(a);
  assert.equal(f[0b11], 4);
  assert.equal(f[0b10], 2);
});

test('sos-dp 单位掩码等于自身', () => {
  const a = [7, 3, 5, 9];
  const f = sosDp(a);
  for (let m = 0; m < 4; m++) assert.ok(f[m]! >= a[m]!);
});

test('sos-dp 边界', () => {
  assert.deepEqual(sosDp([]), []);
  assert.deepEqual(sosDp([42]), [42]);
});

test('sos-dp 钩子被调用', () => {
  let bits = 0;
  let merges = 0;
  sosDp([1, 1, 1, 1], {
    onBit: () => bits++,
    onMerge: () => merges++,
  });
  assert.equal(bits, 2);
  assert.ok(merges > 0);
});

test('sos-dp buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
