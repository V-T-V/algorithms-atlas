import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orangesRotting } from '../../src/algorithms/network/net-rotten-oranges/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-rotten-oranges/trace.ts';
test('orangesRotting 正确', () => {
  assert.equal(
    orangesRotting(
      [
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1],
      ].map((r) => [...r]),
    ),
    4,
  );
  assert.equal(
    orangesRotting(
      [
        [2, 1, 1],
        [0, 1, 1],
        [1, 0, 1],
      ].map((r) => [...r]),
    ),
    -1,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
