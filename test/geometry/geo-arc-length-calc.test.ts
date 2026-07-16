import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arcLength } from '../../src/algorithms/geometry/geo-arc-length-calc/impl.ts';
test('半圆弧长', () => {
  assert.ok(Math.abs(arcLength(2, Math.PI) - 2 * Math.PI) < 1e-9);
});
