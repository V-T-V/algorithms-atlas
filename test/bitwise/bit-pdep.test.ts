import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pdep } from '../../src/algorithms/bitwise/bit-pdep/impl.ts';
import { pext } from '../../src/algorithms/bitwise/bit-pext/impl.ts';

test('pdep 已知值', () => {
  assert.equal(pdep(0, 0), 0);
  assert.equal(pdep(0xf, 0xf0), 0xf0);
  assert.equal(pdep(0xf, 0x0f), 0x0f);
  assert.equal(pdep(0xffffffff, 0), 0);
  assert.equal(pdep(0xdeadbeef, 0xffffffff), 0xdeadbeef);
});

test('pdep 与 depositBits 等价', () => {
  function depositRef(x: number, m: number): number {
    let r = 0,
      s = 0,
      mm = m >>> 0,
      p = 0;
    while (mm) {
      if (mm & 1) {
        r |= ((x >>> s) & 1) << p;
        s++;
      }
      p++;
      mm >>>= 1;
    }
    return r >>> 0;
  }
  const xs = [0x12345678, 0xdeadbeef, 0xaaaa5555, 0x1234, 0];
  const ms = [0x0f0f0f0f, 0xffff0000, 0xaaaaaaaa, 0x1, 0x80000000];
  for (const x of xs) for (const m of ms) assert.equal(pdep(x, m), depositRef(x, m));
});

test('pdep 与 pext 互逆：pext(pdep(x,m),m) === x 截断到 popcount(m) 位', () => {
  const xs = [0x12345678, 0xdeadbeef, 0xffffffff, 0xaaaa5555];
  const ms = [0x0f0f0f0f, 0x0000ffff, 0xaaaaaaaa, 0x1, 0x80000000];
  for (const x of xs)
    for (const m of ms) {
      assert.equal(pext(pdep(x, m), m), x & ((1 << countBits(m)) - 1));
    }
});

test('pdep 拒绝越界', () => {
  assert.throws(() => pdep(-1, 0), RangeError);
  assert.throws(() => pdep(0, 2.5), RangeError);
  assert.throws(() => pdep(0, 0x100000000), RangeError);
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
