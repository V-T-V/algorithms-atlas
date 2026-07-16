import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regularPolygon } from '../../src/algorithms/geometry/geo-regular-polygon/impl.ts';
test('正六边形 6 顶点', () => {
  assert.equal(regularPolygon(6, 0, 0, 1).length, 6);
});
test('首顶点在 startAngle', () => {
  const p = regularPolygon(4, 0, 0, 1, Math.PI / 4);
  assert.ok(Math.abs(p[0]!.x - Math.cos(Math.PI / 4)) < 1e-9);
});
test('n<3 报错', () => {
  assert.throws(() => regularPolygon(2, 0, 0, 1), RangeError);
});
