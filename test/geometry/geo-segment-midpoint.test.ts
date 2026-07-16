import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midpoint } from '../../src/algorithms/geometry/geo-segment-midpoint/impl.ts';
test('中点', () => {
  assert.deepEqual(midpoint({ x: 0, y: 0 }, { x: 4, y: 2 }), { x: 2, y: 1 });
});
