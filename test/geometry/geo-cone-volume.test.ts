import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coneVolume } from '../../src/algorithms/geometry/geo-cone-volume/impl.ts';
test('圆锥=1/3圆柱', () => {
  assert.ok(Math.abs(coneVolume(2, 3) - (Math.PI * 2 * 2 * 3) / 3) < 1e-9);
});
