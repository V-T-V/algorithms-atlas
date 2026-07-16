import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scalePolygon } from '../../src/algorithms/geometry/geo-polygon-scale/impl.ts';
test('缩放2倍', () => {
  assert.deepEqual(scalePolygon([{ x: 2, y: 0 }], { x: 0, y: 0 }, 2), [{ x: 4, y: 0 }]);
});
