import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signedArea } from '../../src/algorithms/geometry/geo-triangle-area-signed/impl.ts';
test('正面积 逆时针', () => {
  assert.equal(signedArea({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }), 6);
});
test('负面积 顺时针', () => {
  assert.equal(signedArea({ x: 0, y: 0 }, { x: 0, y: 3 }, { x: 4, y: 0 }), -6);
});
