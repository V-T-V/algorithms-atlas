import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toNormalForm } from '../../src/algorithms/geometry/geo-line-normal-form/impl.ts';
test('3x+4y-10=0 归一化', () => {
  const l = toNormalForm({ a: 3, b: 4, c: -10 });
  assert.ok(Math.abs(l.a - 0.6) < 1e-9);
  assert.ok(Math.abs(l.c - -2) < 1e-9);
});
test('退化报错', () => {
  assert.throws(() => toNormalForm({ a: 0, b: 0, c: 1 }), RangeError);
});
