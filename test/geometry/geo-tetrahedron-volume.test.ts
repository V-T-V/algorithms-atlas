import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tetrahedronVolume } from '../../src/algorithms/geometry/geo-tetrahedron-volume/impl.ts';
test('单位四面体体积 1/6', () => {
  const v = tetrahedronVolume(
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
  );
  assert.ok(Math.abs(v - 1 / 6) < 1e-9);
});
