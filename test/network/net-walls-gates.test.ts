import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wallsAndGates } from '../../src/algorithms/network/net-walls-gates/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-walls-gates/trace.ts';
const INF = 2147483647;
test('wallsAndGates 正确', () => {
  const g = [
    [INF, -1, 0, INF],
    [INF, INF, INF, -1],
    [INF, -1, INF, -1],
    [0, -1, INF, INF],
  ].map((r) => [...r]);
  wallsAndGates(g);
  assert.deepEqual(g, [
    [3, -1, 0, 1],
    [2, 2, 1, -1],
    [1, -1, 2, -1],
    [0, -1, 3, 4],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
