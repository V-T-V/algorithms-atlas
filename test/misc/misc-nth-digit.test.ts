import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findNthDigit } from '../../src/algorithms/misc/misc-nth-digit/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-nth-digit/trace.ts';

test('nth-digit n=3 = 3', () => {
  assert.equal(findNthDigit(3), 3);
});

test('nth-digit n=11 = 0 (来自 10)', () => {
  assert.equal(findNthDigit(11), 0);
});

test('nth-digit n=10 = 1 (来自 10 的十位)', () => {
  assert.equal(findNthDigit(10), 1);
});

test('nth-digit n=190 = 1 (来自 100)', () => {
  assert.equal(findNthDigit(190), 1);
});

test('nth-digit n=1 = 1', () => {
  assert.equal(findNthDigit(1), 1);
});

test('nth-digit 非法抛错', () => {
  assert.throws(() => findNthDigit(0));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
