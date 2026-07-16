import { test } from 'node:test';
import assert from 'node:assert/strict';
import { footOfPerpendicular } from '../../src/algorithms/geometry/geo-foot-perpendicular/impl.ts';
test('垂足 y=0', () => {
  const f = footOfPerpendicular({ x: 1, y: 5 }, { a: 0, b: 1, c: 0 });
  assert.deepEqual(f, { x: 1, y: 0 });
});
test('退化直线报错', () => {
  assert.throws(() => footOfPerpendicular({ x: 0, y: 0 }, { a: 0, b: 0, c: 1 }), RangeError);
});
