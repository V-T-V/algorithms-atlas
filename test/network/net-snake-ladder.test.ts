import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snakesAndLadders } from '../../src/algorithms/network/net-snake-ladder/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-snake-ladder/trace.ts';
test('snakesAndLadders 正确', () => {
  assert.equal(
    snakesAndLadders([
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 35, -1, -1, 13, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 15, -1, -1, -1, -1],
    ]),
    4,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
