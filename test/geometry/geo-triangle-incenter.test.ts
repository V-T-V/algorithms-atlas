import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incenter } from '../../src/algorithms/geometry/geo-triangle-incenter/impl.ts';
test('内心 3-4-5 三角形', () => {
  const r = incenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  assert.ok(Math.abs(r.radius - 2) < 1e-9);
});
