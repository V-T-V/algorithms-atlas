import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleCircumference } from '../../src/algorithms/geometry/geo-circle-circumference/impl.ts';
test('单位圆周长', () => {
  assert.ok(Math.abs(circleCircumference(1) - 2 * Math.PI) < 1e-9);
});
