import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isUglyNumber, listUgly } from '../../src/algorithms/misc/misc-ugly-number-2/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-ugly-number-2/trace.ts';

test('ugly-check 6 = true', () => {
  assert.equal(isUglyNumber(6), true);
});

test('ugly-check 1 = true', () => {
  assert.equal(isUglyNumber(1), true);
});

test('ugly-check 14 = false', () => {
  assert.equal(isUglyNumber(14), false);
});

test('ugly-check 负数 = false', () => {
  assert.equal(isUglyNumber(-6), false);
});

test('ugly-check 0 = false', () => {
  assert.equal(isUglyNumber(0), false);
});

test('ugly-check 8 = true', () => {
  assert.equal(isUglyNumber(8), true);
});

test('ugly-check listUgly 20', () => {
  assert.deepEqual(listUgly(20), [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20]);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
