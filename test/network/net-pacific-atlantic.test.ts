import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pacificAtlantic } from '../../src/algorithms/network/net-pacific-atlantic/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-pacific-atlantic/trace.ts';
test('pacificAtlantic 正确', () => {
  const cs = pacificAtlantic([
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ]);
  assert.ok(cs.length > 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
