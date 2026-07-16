import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floodFill } from '../../src/algorithms/network/net-grid-flood-fill/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-grid-flood-fill/trace.ts';
test('floodFill 正确', () => {
  const g = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
  ];
  assert.deepEqual(floodFill(g, 1, 1, 2), [
    [2, 2, 2],
    [2, 2, 0],
    [2, 0, 1],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
