import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integerBreak, integerBreakDp } from '../../src/algorithms/misc/misc-integer-break/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-integer-break/trace.ts';

test('int-break n=2 = 1', () => {
  assert.equal(integerBreak(2), 1);
});

test('int-break n=10 = 36', () => {
  assert.equal(integerBreak(10), 36);
});

test('int-break n=3 = 2', () => {
  assert.equal(integerBreak(3), 2);
});

test('int-break n=4 = 4', () => {
  assert.equal(integerBreak(4), 4);
});

test('int-break 贪心 == DP', () => {
  for (let n = 2; n <= 50; n++) {
    assert.equal(integerBreak(n), integerBreakDp(n), `n=${n}`);
  }
});

test('int-break 非法抛错', () => {
  assert.throws(() => integerBreak(1));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
