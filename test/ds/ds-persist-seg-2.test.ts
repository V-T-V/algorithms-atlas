import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PersistSeg2 } from '../../src/algorithms/ds/ds-persist-seg-2/impl.ts';

test('persist-seg 版本隔离', () => {
  const pst = new PersistSeg2(5);
  const v1 = pst.update(1, 5);
  const v2 = pst.update(3, 7);
  assert.equal(pst.prefix(v1, 4), 5);
  assert.equal(pst.prefix(v2, 4), 12);
  assert.equal(pst.prefix(0, 4), 0);
});

test('persist-seg 节点数随版本增长', () => {
  const pst = new PersistSeg2(5);
  const n0 = pst.nodeCount;
  pst.update(1, 5);
  pst.update(2, 3);
  assert.ok(pst.nodeCount > n0);
  assert.equal(pst.versionCount, 3);
});
