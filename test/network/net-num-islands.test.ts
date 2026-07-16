import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numIslands } from '../../src/algorithms/network/net-num-islands/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-num-islands/trace.ts';
test('numIslands 正确', () => {
  assert.equal(
    numIslands(
      [
        ['1', '1', '0'],
        ['1', '0', '0'],
        ['0', '0', '1'],
      ].map((r) => [...r]),
    ),
    2,
  );
  assert.equal(
    numIslands(
      [
        ['1', '1', '1'],
        ['0', '1', '0'],
        ['1', '1', '1'],
      ].map((r) => [...r]),
    ),
    1,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
