import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barycentric } from '../../src/algorithms/geometry/geo-barycentric-coord/impl.ts';
test('顶点A的u=1', () => {
  const r = barycentric({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(r.u - 1) < 1e-9);
});
test('和为1', () => {
  const r = barycentric({ x: 0.2, y: 0.3 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });
  assert.ok(Math.abs(r.u + r.v + r.w - 1) < 1e-9);
});
