import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConvex } from '../../src/algorithms/geometry/geo-polygon-convex-check/impl.ts';
test('矩形凸', () => {
  assert.equal(
    isConvex([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 3 },
      { x: 0, y: 3 },
    ]),
    true,
  );
});
test('凹多边形', () => {
  assert.equal(
    isConvex([
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ]),
    false,
  );
});
