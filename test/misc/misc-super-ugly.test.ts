import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nthSuperUglyNumber } from '../../src/algorithms/misc/misc-super-ugly/impl.ts';
import {
  buildTrace,
  DEFAULT_N,
  DEFAULT_PRIMES,
} from '../../src/algorithms/misc/misc-super-ugly/trace.ts';

test('super-ugly n=1 = 1', () => {
  assert.equal(nthSuperUglyNumber(1, [2, 3, 5]), 1);
});

test('super-ugly n=12, [2,7,13,19] = 32', () => {
  assert.equal(nthSuperUglyNumber(12, [2, 7, 13, 19]), 32);
});

test('super-ugly [2] 退化为 2 的幂', () => {
  assert.equal(nthSuperUglyNumber(5, [2]), 16);
});

test('super-ugly [2,3,5] == 普通丑数', () => {
  // 1,2,3,4,5,6,8,9,10,12
  assert.equal(nthSuperUglyNumber(10, [2, 3, 5]), 12);
});

test('super-ugly 非法抛错', () => {
  assert.throws(() => nthSuperUglyNumber(0, [2]));
  assert.throws(() => nthSuperUglyNumber(5, []));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_N, DEFAULT_PRIMES);
  assert.ok(frames.length >= 3);
});
