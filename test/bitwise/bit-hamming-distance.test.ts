import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hammingDistance } from '../../src/algorithms/bitwise/bit-hamming-distance/impl.ts';

function naivePop(n: number): number {
  return (n >>> 0).toString(2).replace(/0/g, '').length;
}

test('hammingDistance 基本', () => {
  assert.equal(hammingDistance(0, 0), 0);
  assert.equal(hammingDistance(0, 0xffffffff), 32);
  assert.equal(hammingDistance(0x55555555, 0xaaaaaaaa), 32);
  assert.equal(hammingDistance(1, 1), 0);
  assert.equal(hammingDistance(0xff, 0), 8);
});

test('hammingDistance 对称性 d(x,y) === d(y,x)', () => {
  const samples = [0, 1, 0x55, 0xaa, 0x12345678, 0xdeadbeef, 0xffffffff];
  for (const x of samples)
    for (const y of samples) {
      assert.equal(hammingDistance(x, y), hammingDistance(y, x));
    }
});

test('hammingDistance 三角不等式 d(x,z) ≤ d(x,y) + d(y,z)', () => {
  const xs = [0, 0x55, 0xaa, 0x1234, 0xdeadbeef];
  for (const a of xs)
    for (const b of xs)
      for (const c of xs) {
        assert.ok(hammingDistance(a, c) <= hammingDistance(a, b) + hammingDistance(b, c));
      }
});

test('hammingDistance 与 XOR popcount 一致', () => {
  const xs = [0, 1, 0xff, 0x12345678, 0xdeadbeef, 0xffffffff, 0x80000000];
  const ys = [0xff, 0x100, 0xffff, 0x87654321, 0, 0x1, 0x7fffffff];
  for (let i = 0; i < xs.length; i++) {
    assert.equal(hammingDistance(xs[i]!, ys[i]!), naivePop((xs[i]! ^ ys[i]!) >>> 0));
  }
});

test('hammingDistance 拒绝越界', () => {
  assert.throws(() => hammingDistance(-1, 0), RangeError);
  assert.throws(() => hammingDistance(0, 1.5), RangeError);
  assert.throws(() => hammingDistance(0, 0x100000000), RangeError);
});
