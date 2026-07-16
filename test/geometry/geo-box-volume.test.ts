import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boxVolume } from '../../src/algorithms/geometry/geo-box-volume/impl.ts';
test('2x3x4', () => {
  assert.equal(boxVolume(2, 3, 4), 24);
});
