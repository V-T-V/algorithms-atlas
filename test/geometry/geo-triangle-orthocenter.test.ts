import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orthocenter } from '../../src/algorithms/geometry/geo-triangle-orthocenter/impl.ts';
test('垂心 直角三角形=直角顶点', () => {
  const h = orthocenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(h.x) < 1e-9 && Math.abs(h.y) < 1e-9);
});
