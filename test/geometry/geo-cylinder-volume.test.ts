import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cylinderVolume } from '../../src/algorithms/geometry/geo-cylinder-volume/impl.ts';
test('单位圆柱', () => {
  assert.ok(Math.abs(cylinderVolume(1, 1) - Math.PI) < 1e-9);
});
