import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCheapestPrice } from '../../src/algorithms/network/net-cheapest-flights/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-cheapest-flights/trace.ts';
test('findCheapestPrice 正确', () => {
  assert.equal(
    findCheapestPrice(
      4,
      [
        [0, 1, 100],
        [1, 2, 100],
        [2, 3, 100],
        [0, 2, 500],
      ],
      0,
      3,
      1,
    ),
    700,
  );
  assert.equal(
    findCheapestPrice(
      4,
      [
        [0, 1, 100],
        [1, 2, 100],
        [2, 3, 100],
        [0, 2, 500],
      ],
      0,
      3,
      0,
    ),
    500,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
