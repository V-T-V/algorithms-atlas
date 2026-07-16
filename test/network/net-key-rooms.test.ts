import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canVisitAllRooms } from '../../src/algorithms/network/net-key-rooms/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-key-rooms/trace.ts';
test('canVisitAllRooms 正确', () => {
  assert.equal(canVisitAllRooms([[1], [2], [3], []]), true);
  assert.equal(canVisitAllRooms([[1, 3], [3, 0, 1], [2], [0]]), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
