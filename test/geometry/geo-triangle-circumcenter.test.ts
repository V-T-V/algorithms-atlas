import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circumcenter } from '../../src/algorithms/geometry/geo-triangle-circumcenter/impl.ts';
test('外心 直角三角形', () => {
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(Math.abs(r.center.x - 2) < 1e-9);
  assert.ok(Math.abs(r.center.y - 1.5) < 1e-9);
  assert.ok(Math.abs(r.radius - 2.5) < 1e-9);
});
test('外心 共线报错', () => {
  assert.throws(() => circumcenter({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), RangeError);
});
