import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pext } from '../../src/algorithms/bitwise/bit-pext/impl.ts';
import { pdep } from '../../src/algorithms/bitwise/bit-pdep/impl.ts';

test('pext 已知值', () => {
  assert.equal(pext(0, 0), 0);
  assert.equal(pext(0xffffffff, 0), 0);
  assert.equal(pext(0xff, 0xf0), 0xf);
  assert.equal(pext(0xff, 0x0f), 0xf);
  assert.equal(pext(0xdeadbeef, 0xffffffff), 0xdeadbeef);
  assert.equal(pext(0xdeadbeef, 0x0f0f0f0f), 0xdeeb);
});

test('pext 与 extractBits 等价', () => {
  function extractRef(x: number, m: number): number {
    let r = 0,
      d = 0,
      mm = m >>> 0,
      p = 0;
    while (mm) {
      if (mm & 1) {
        r |= ((x >>> p) & 1) << d;
        d++;
      }
      p++;
      mm >>>= 1;
    }
    return r >>> 0;
  }
  const xs = [0x12345678, 0xdeadbeef, 0xaaaaaaaa, 0x55555555, 0];
  const ms = [0x0f0f0f0f, 0xffff0000, 0xaaaaaaaa, 0x1, 0x80000000];
  for (const x of xs) for (const m of ms) assert.equal(pext(x, m), extractRef(x, m));
});

test('pext 与 pdep 互逆：pdep(pext(x,m),m) === x & m', () => {
  const xs = [0x12345678, 0xdeadbeef, 0xffffffff, 0xaaaa5555];
  const ms = [0x0f0f0f0f, 0x0000ffff, 0xaaaaaaaa, 0x1, 0x80000000];
  for (const x of xs)
    for (const m of ms) {
      assert.equal(pdep(pext(x, m), m) >>> 0, (x & m) >>> 0);
    }
});

test('pext 拒绝越界', () => {
  assert.throws(() => pext(-1, 0), RangeError);
  assert.throws(() => pext(0, 1.5), RangeError);
  assert.throws(() => pext(0, 0x100000000), RangeError);
});
