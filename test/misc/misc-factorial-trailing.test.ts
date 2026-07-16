import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trailingZeroes,
  trailingZeroesBrute,
} from '../../src/algorithms/misc/misc-factorial-trailing/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/misc-factorial-trailing/trace.ts';

test('trailing-zeroes 5 = 1', () => {
  assert.equal(trailingZeroes(5), 1);
});

test('trailing-zeroes 25 = 6', () => {
  assert.equal(trailingZeroes(25), 6);
});

test('trailing-zeroes 0 = 0', () => {
  assert.equal(trailingZeroes(0), 0);
});

test('trailing-zeroes 3 = 0', () => {
  assert.equal(trailingZeroes(3), 0);
});

test('trailing-zeroes 公式 == 暴力 BigInt', () => {
  for (let n = 0; n <= 100; n++) {
    assert.equal(trailingZeroes(n), trailingZeroesBrute(n), `n=${n}`);
  }
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
