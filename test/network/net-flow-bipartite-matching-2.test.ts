import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxFlowBipartiteMatching } from '../../src/algorithms/network/net-flow-bipartite-matching-2/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-flow-bipartite-matching-2/trace.ts';

test('net-flow-bipartite-matching-2 完全二分图', () => {
  const r = maxFlowBipartiteMatching({
    nLeft: 3,
    nRight: 3,
    edges: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 2],
    ],
  });
  assert.equal(r.size, 3);
});

test('net-flow-bipartite-matching-2 空图', () => {
  const r = maxFlowBipartiteMatching({ nLeft: 2, nRight: 2, edges: [] });
  assert.equal(r.size, 0);
});

test('net-flow-bipartite-matching-2 不平衡二分图', () => {
  const r = maxFlowBipartiteMatching({
    nLeft: 4,
    nRight: 2,
    edges: [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
    ],
  });
  assert.equal(r.size, 2);
});

test('net-flow-bipartite-matching-2 匹配互异', () => {
  const r = maxFlowBipartiteMatching({
    nLeft: 3,
    nRight: 3,
    edges: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  });
  // 只有一个右点，最多匹配 1
  assert.equal(r.size, 1);
  const rightSet = new Set(r.pairs.map((p) => p.right));
  assert.equal(rightSet.size, 1);
});

test('net-flow-bipartite-matching-2 trace', () => {
  assert.ok(buildTrace().length >= 2);
});
