import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxAreaOfIsland } from '../../src/algorithms/network/net-max-area-island/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-area-island/trace.ts';
test('maxAreaOfIsland 正确', () => {
  assert.equal(
    maxAreaOfIsland(
      [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 0, 0, 0],
      ].map((r) => [...r]),
    ),
    5,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
