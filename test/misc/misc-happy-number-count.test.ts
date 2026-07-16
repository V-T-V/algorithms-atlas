import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isHappyNumber,
  countHappyNumbers,
} from '../../src/algorithms/misc/misc-happy-number-count/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/misc-happy-number-count/trace.ts';

test('happy-number 19 = true', () => {
  assert.equal(isHappyNumber(19), true);
});

test('happy-number 1 = true', () => {
  assert.equal(isHappyNumber(1), true);
});

test('happy-number 4 = false', () => {
  assert.equal(isHappyNumber(4), false);
});

test('happy-number 7 = true', () => {
  assert.equal(isHappyNumber(7), true);
});

test('happy-count 20 = ? (一致)', () => {
  let brute = 0;
  for (let i = 1; i <= 20; i++) if (isHappyNumber(i)) brute++;
  assert.equal(countHappyNumbers(20), brute);
});

test('happy-number 负数 false', () => {
  assert.equal(isHappyNumber(-5), false);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
