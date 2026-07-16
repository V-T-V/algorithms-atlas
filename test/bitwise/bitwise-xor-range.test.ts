import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  xorRange,
  xorOneToN,
  xorRangeNaive,
} from '../../src/algorithms/bitwise/bitwise-xor-range/impl.ts';

test('xorOneToN 公式正确', () => {
  assert.equal(xorOneToN(0), 0);
  assert.equal(xorOneToN(1), 1);
  assert.equal(xorOneToN(2), 3);
  assert.equal(xorOneToN(3), 0);
  assert.equal(xorOneToN(4), 4);
  assert.equal(xorOneToN(7), 0);
  assert.equal(xorOneToN(8), 8);
});

test('xorRange 与朴素法一致', () => {
  for (let lo = 0; lo <= 30; lo++) {
    for (let hi = lo; hi <= 30; hi++) {
      assert.equal(xorRange(lo, hi), xorRangeNaive(lo, hi), `[${lo},${hi}]`);
    }
  }
});

test('xorRange 边界', () => {
  assert.equal(xorRange(0, 0), 0);
  assert.equal(xorRange(5, 5), 5);
  assert.equal(xorRange(0, 10), xorRangeNaive(0, 10));
});

test('xorRange 拒绝非法区间', () => {
  assert.throws(() => xorRange(-1, 5), RangeError);
  assert.throws(() => xorRange(5, 3), RangeError);
});

test('xorRange 钩子触发前缀计算', () => {
  let calls = 0;
  xorRange(3, 9, { onPrefixXor: () => calls++ });
  assert.ok(calls >= 1);
});
