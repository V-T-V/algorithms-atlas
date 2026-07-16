import { test } from 'node:test';
import assert from 'node:assert/strict';
import { largestNumber } from '../../src/algorithms/misc/misc-largest-number/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-largest-number/trace.ts';

test('largest-number [10,2] = "210"', () => {
  assert.equal(largestNumber([10, 2]), '210');
});

test('largest-number [3,30,34,5,9] = "9534330"', () => {
  assert.equal(largestNumber([3, 30, 34, 5, 9]), '9534330');
});

test('largest-number 全 0 = "0"', () => {
  assert.equal(largestNumber([0, 0, 0]), '0');
});

test('largest-number [1] = "1"', () => {
  assert.equal(largestNumber([1]), '1');
});

test('largest-number 空输入 = ""', () => {
  assert.equal(largestNumber([]), '');
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
