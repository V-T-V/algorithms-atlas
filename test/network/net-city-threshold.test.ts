import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findTheCity } from '../../src/algorithms/network/net-city-threshold/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-city-threshold/trace.ts';
test('findTheCity 正确', () => {
  assert.equal(
    findTheCity(
      4,
      [
        [0, 1, 3],
        [1, 2, 1],
        [1, 3, 4],
        [2, 3, 1],
      ],
      4,
    ),
    3,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
