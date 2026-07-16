import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centroid } from '../../src/algorithms/geometry/geo-triangle-centroid/impl.ts';
test('重心', () => {
  const g = centroid({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(g.x - 1) < 1e-9 && Math.abs(g.y - 1) < 1e-9);
});
