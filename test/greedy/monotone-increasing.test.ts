import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monotoneIncreasing } from '../../src/algorithms/greedy/monotone-increasing/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/greedy/monotone-increasing/trace.ts';

test('monotoneIncreasing 已知值', () => {
  assert.equal(monotoneIncreasing(9).value, 9); // 个位已不降
  assert.equal(monotoneIncreasing(10).value, 9); // 1->0 降序，结果 9
  assert.equal(monotoneIncreasing(1234).value, 1234);
  assert.equal(monotoneIncreasing(332).value, 299);
  assert.equal(monotoneIncreasing(321).value, 299);
});

test('monotoneIncreasing 个位数', () => {
  assert.equal(monotoneIncreasing(5).value, 5);
});

test('monotoneIncreasing 已单调不降', () => {
  assert.equal(monotoneIncreasing(112).value, 112);
});

test('buildTrace 含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
