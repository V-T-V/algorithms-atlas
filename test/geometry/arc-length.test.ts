import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arcLength,
  arcLengthFromChord,
  degreesToRadians,
} from '../../src/algorithms/geometry/arc-length/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('arcLength: 基本公式 L = r·θ', () => {
  assert.ok(close(arcLength(Math.PI, 2), 2 * Math.PI));
  assert.ok(close(arcLength(Math.PI / 2, 4), 2 * Math.PI));
});

test('arcLength: 整圆 θ=2π → 周长 2πr', () => {
  assert.ok(close(arcLength(2 * Math.PI, 3), 6 * Math.PI));
});

test('arcLength: 零角 → 零长', () => {
  assert.ok(close(arcLength(0, 5), 0));
});

test('degreesToRadians: 180° → π', () => {
  assert.ok(close(degreesToRadians(180), Math.PI));
  assert.ok(close(degreesToRadians(90), Math.PI / 2));
  assert.ok(close(degreesToRadians(0), 0));
});

test('arcLengthFromChord: 弦长 = 直径 → 半圆弧', () => {
  // c = 2r → θ = 2·asin(1) = π → L = πr
  assert.ok(close(arcLengthFromChord(4, 2), 2 * Math.PI));
});

test('arcLengthFromChord: 弦长 0 → 0', () => {
  assert.ok(close(arcLengthFromChord(0, 5), 0));
});

test('arcLength: hooks 正确回调', () => {
  let got: { t: number; l: number } | null = null;
  arcLength(1, 2, { onArcLength: (t, l) => (got = { t, l }) });
  assert.equal(got!.t, 1);
  assert.equal(got!.l, 2);
});

test('arcLength: 非法入参抛错', () => {
  assert.throws(() => arcLength(1, -1), RangeError);
  assert.throws(() => arcLength(-1, 1), RangeError);
  assert.throws(() => arcLengthFromChord(5, 2), RangeError); // c > 2r
  assert.throws(() => arcLengthFromChord(1, 0), RangeError);
});
