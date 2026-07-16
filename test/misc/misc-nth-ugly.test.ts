import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nthUglyNumber, isUgly } from '../../src/algorithms/misc/misc-nth-ugly/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-nth-ugly/trace.ts';

test('nth-ugly n=10 = 12', () => {
  assert.equal(nthUglyNumber(10), 12);
});

test('nth-ugly n=1 = 1', () => {
  assert.equal(nthUglyNumber(1), 1);
});

test('nth-ugly n=7 = 8', () => {
  assert.equal(nthUglyNumber(7), 8);
});

test('nth-ugly 前 10 个正确', () => {
  const expected = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12];
  for (let i = 1; i <= 10; i++) {
    assert.equal(nthUglyNumber(i), expected[i - 1]);
  }
});

test('nth-ugly 结果都是丑数', () => {
  for (let n = 1; n <= 50; n++) {
    assert.equal(isUgly(nthUglyNumber(n)), true);
  }
});

test('nth-ugly 非法抛错', () => {
  assert.throws(() => nthUglyNumber(0));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
