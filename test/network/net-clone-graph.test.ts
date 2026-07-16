import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cloneGraph, type GNode } from '../../src/algorithms/network/net-clone-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-clone-graph/trace.ts';
test('cloneGraph 深拷贝', () => {
  const n1: GNode = { val: '1', neighbors: [] },
    n2: GNode = { val: '2', neighbors: [] };
  n1.neighbors = [n2];
  n2.neighbors = [n1];
  const c1 = cloneGraph(n1)!;
  assert.equal(c1.val, '1');
  assert.notEqual(c1, n1);
  assert.equal(c1.neighbors[0]!.val, '2');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
