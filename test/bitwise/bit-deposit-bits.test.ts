import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depositBits } from '../../src/algorithms/bitwise/bit-deposit-bits/impl.ts';
import { extractBits } from '../../src/algorithms/bitwise/bit-extract-bits/impl.ts';

test('depositBits 基本', () => {
  assert.equal(depositBits(0, 0), 0);
  assert.equal(depositBits(0xf, 0xf0), 0xf0); // 低 4 位全 1 → 放到高 4 位
  assert.equal(depositBits(0xf, 0x0f), 0x0f); // 低 4 位全 1 → 放到低 4 位
  assert.equal(depositBits(0b11, 0b010101), 0b010101); // 两位 1 散布到三个 1 位中的前两个
});

test('depositBits m=0 返回 0', () => {
  assert.equal(depositBits(0xffffffff, 0), 0);
});

test('depositBits m=0xffffffff 放置全部', () => {
  assert.equal(depositBits(0x12345678, 0xffffffff), 0x12345678);
});

test('depositBits 与 extractBits 互逆', () => {
  const xs = [0x12345678, 0xdeadbeef, 0xffffffff, 0, 0xaaaa5555, 0x1234];
  const ms = [0x0f0f0f0f, 0x0000ffff, 0xaaaaaaaa, 0x1, 0x80000000, 0xf0f0f0f0];
  for (const x of xs) {
    for (const m of ms) {
      const d = depositBits(x, m);
      // extract(deposit(x,m), m) === x 截断到 popcount(m) 位
      assert.equal(extractBits(d, m), x & ((1 << countBits(m)) - 1));
    }
  }
});

test('depositBits 拒绝越界', () => {
  assert.throws(() => depositBits(-1, 0), RangeError);
  assert.throws(() => depositBits(0, 2.5), RangeError);
  assert.throws(() => depositBits(0, 0x100000000), RangeError);
});

function countBits(n: number): number {
  let c = 0;
  let v = n >>> 0;
  while (v) {
    v &= v - 1;
    c++;
  }
  return c;
}
