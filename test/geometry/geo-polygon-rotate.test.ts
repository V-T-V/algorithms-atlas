import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotatePolygon } from '../../src/algorithms/geometry/geo-polygon-rotate/impl.ts';
test('旋转90°', () => {
  const r = rotatePolygon([{ x: 1, y: 0 }], { x: 0, y: 0 }, Math.PI / 2);
  assert.ok(Math.abs(r[0]!.y - 1) < 1e-9);
});
