import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRedundantConnection } from '../../src/algorithms/network/net-redundant-conn/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-redundant-conn/trace.ts';
test('findRedundantConnection 正确', () => {
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [1, 3],
      [2, 3],
    ]),
    [2, 3],
  );
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [1, 5],
    ]),
    [1, 4],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
