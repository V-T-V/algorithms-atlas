import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sphereSurfaceArea } from '../../src/algorithms/geometry/geo-sphere-surface-area/impl.ts';
test('单位球', () => {
  assert.ok(Math.abs(sphereSurfaceArea(1) - 4 * Math.PI) < 1e-9);
});
