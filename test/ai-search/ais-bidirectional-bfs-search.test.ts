import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bidirectionalBfs,
  type BiBfsGraph,
} from '../../src/algorithms/ai-search/ais-bidirectional-bfs-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bidirectional-bfs-search/trace.ts';
const G: BiBfsGraph = {
  start: 0,
  goal: 3,
  adj: (n) => (n === 0 ? [1, 2] : n === 1 ? [0, 3] : n === 2 ? [0, 3] : n === 3 ? [1, 2] : []),
};
test('bi-bfs 找到最短路径', () => assert.deepEqual(bidirectionalBfs(G), [0, 1, 3]));
test('bi-bfs trace 非空', () => assert.ok(buildTrace().length >= 2));
