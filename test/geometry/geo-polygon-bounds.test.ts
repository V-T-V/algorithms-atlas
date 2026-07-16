import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonBounds } from '../../src/algorithms/geometry/geo-polygon-bounds/impl.ts';
test('包围盒', () => {
  const b = polygonBounds([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ]);
  assert.equal(b!.width, 4);
  assert.equal(b!.height, 3);
});
test('空集返回null', () => {
  assert.equal(polygonBounds([]), null);
});
