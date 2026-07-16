import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minkowskiSum } from '../../src/algorithms/geometry/geo-minkowski-sum/impl.ts';
test('两单位方形之和', () => {
  const sq = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  const r = minkowskiSum(sq, sq);
  assert.ok(r.length >= 4);
});
