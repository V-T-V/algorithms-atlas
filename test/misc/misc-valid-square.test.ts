import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPerfectSquare,
  isPerfectSquareNewton,
} from '../../src/algorithms/misc/misc-valid-square/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-valid-square/trace.ts';

test('valid-square 16 = true', () => {
  assert.equal(isPerfectSquare(16), true);
});

test('valid-square 14 = false', () => {
  assert.equal(isPerfectSquare(14), false);
});

test('valid-square 1 = true', () => {
  assert.equal(isPerfectSquare(1), true);
});

test('valid-square 0 = false', () => {
  assert.equal(isPerfectSquare(0), false);
});

test('valid-square 100 = true', () => {
  assert.equal(isPerfectSquare(100), true);
});

test('valid-square 二分 == 牛顿', () => {
  for (let n = 1; n <= 500; n++) {
    assert.equal(isPerfectSquare(n), isPerfectSquareNewton(n), `n=${n}`);
  }
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
