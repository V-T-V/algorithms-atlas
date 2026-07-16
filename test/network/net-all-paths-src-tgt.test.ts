import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPathsSourceTarget } from '../../src/algorithms/network/net-all-paths-src-tgt/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-all-paths-src-tgt/trace.ts';
test('allPathsSourceTarget 正确', () => {
  assert.deepEqual(allPathsSourceTarget([[1, 2], [3], [3], []]), [
    [0, 1, 3],
    [0, 2, 3],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
