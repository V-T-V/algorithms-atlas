import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleArea } from '../../src/algorithms/geometry/geo-circle-area-calc/impl.ts';
test('单位圆面积', () => {
  assert.ok(Math.abs(circleArea(1) - Math.PI) < 1e-9);
});
test('负半径报错', () => {
  assert.throws(() => circleArea(-1), RangeError);
});
