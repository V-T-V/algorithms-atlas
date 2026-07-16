import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toGray, fromGray } from '../../src/algorithms/bitwise/bit-gray-code-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-gray-code-2/trace.ts';
test('toGray 正确', () => {
  assert.equal(toGray(0), 0);
  assert.equal(toGray(1), 1);
  assert.equal(toGray(2), 3);
  assert.equal(toGray(3), 2);
  assert.equal(toGray(4), 6);
});
test('toGray/fromGray 互逆', () => {
  for (let x = 0; x < 1000; x++) assert.equal(fromGray(toGray(x)), x);
});
test('相邻格雷码仅差1位', () => {
  const cnt = (n: number) => {
    let c = 0,
      v = n >>> 0;
    while (v) {
      c += v & 1;
      v >>>= 1;
    }
    return c;
  };
  for (let x = 0; x < 100; x++) assert.equal(cnt(toGray(x) ^ toGray(x + 1)), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
