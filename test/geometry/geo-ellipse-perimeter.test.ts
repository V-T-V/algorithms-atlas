import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ellipsePerimeter } from '../../src/algorithms/geometry/geo-ellipse-perimeter/impl.ts';
test('椭圆 a=b 为圆', () => {
  const p = ellipsePerimeter(3, 3);
  assert.ok(Math.abs(p - 2 * Math.PI * 3) < 1e-9);
});
test('负半轴报错', () => {
  assert.throws(() => ellipsePerimeter(-1, 2), RangeError);
});
