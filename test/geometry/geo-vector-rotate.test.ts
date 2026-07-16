import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotate } from '../../src/algorithms/geometry/geo-vector-rotate/impl.ts';
test('旋转 90°', () => {
  const r = rotate({ x: 1, y: 0 }, Math.PI / 2);
  assert.ok(Math.abs(r.x) < 1e-9);
  assert.ok(Math.abs(r.y - 1) < 1e-9);
});
test('旋转 0° 不变', () => {
  const r = rotate({ x: 3, y: 4 }, 0);
  assert.deepEqual(r, { x: 3, y: 4 });
});
