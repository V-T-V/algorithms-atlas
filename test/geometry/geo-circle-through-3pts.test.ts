import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleThrough3 } from '../../src/algorithms/geometry/geo-circle-through-3pts/impl.ts';
test('三点定圆 半径', () => {
  const c = circleThrough3({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(c.radius - 2.5) < 1e-9);
});
test('共线报错', () => {
  assert.throws(() => circleThrough3({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), RangeError);
});
