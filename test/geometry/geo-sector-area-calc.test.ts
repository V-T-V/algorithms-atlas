import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectorArea } from '../../src/algorithms/geometry/geo-sector-area-calc/impl.ts';
test('半圆扇形=半圆面积', () => {
  assert.ok(Math.abs(sectorArea(2, Math.PI) - 2 * Math.PI) < 1e-9);
});
