import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quadrilateralArea } from '../../src/algorithms/geometry/geo-quadrilateral-area/impl.ts';
test('矩形面积', () => {
  assert.equal(
    quadrilateralArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }),
    12,
  );
});
