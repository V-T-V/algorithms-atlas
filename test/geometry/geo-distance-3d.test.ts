import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distance3D } from '../../src/algorithms/geometry/geo-distance-3d/impl.ts';
test('单位距离', () => {
  assert.equal(distance3D({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 2 }), 3);
});
