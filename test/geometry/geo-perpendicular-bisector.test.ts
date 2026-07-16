import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perpendicularBisector } from '../../src/algorithms/geometry/geo-perpendicular-bisector/impl.ts';
test('水平线段中垂线', () => {
  const l = perpendicularBisector({ x: 0, y: 0 }, { x: 2, y: 0 });
  assert.equal(l.a, 2);
  assert.equal(l.c, -2);
});
