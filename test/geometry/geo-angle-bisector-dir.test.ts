import { test } from 'node:test';
import assert from 'node:assert/strict';
import { angleBisector } from '../../src/algorithms/geometry/geo-angle-bisector-dir/impl.ts';
test('直角平分线', () => {
  const d = angleBisector({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(d.x - d.y) < 1e-9);
});
