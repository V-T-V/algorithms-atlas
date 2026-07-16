import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonPerimeter } from '../../src/algorithms/geometry/geo-polygon-perimeter/impl.ts';
test('矩形周长', () => {
  const p = polygonPerimeter([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ]);
  assert.equal(p, 14);
});
test('少于2点 周长0', () => {
  assert.equal(polygonPerimeter([{ x: 0, y: 0 }]), 0);
});
