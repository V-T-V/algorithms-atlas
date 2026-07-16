import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestPathBinaryMatrix } from '../../src/algorithms/network/net-grid-shortest/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-grid-shortest/trace.ts';
test('shortestPathBinaryMatrix 正确', () => {
  assert.equal(
    shortestPathBinaryMatrix(
      [
        [0, 1],
        [1, 0],
      ].map((r) => [...r]),
    ),
    2,
  );
  assert.equal(
    shortestPathBinaryMatrix(
      [
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ].map((r) => [...r]),
    ),
    4,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
