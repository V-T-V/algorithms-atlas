import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aoStarSearch,
  type AoProblem,
  type AoNode,
} from '../../src/algorithms/ai-search/ais-ao-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ao-star/trace.ts';
const nodes = new Map<number, AoNode>([
  [0, { id: 0, isGoal: false, connectors: [{ children: [1], cost: 1 }] }],
  [1, { id: 1, isGoal: true, connectors: [] }],
]);
const P: AoProblem = { nodes, root: 0, h: () => 1 };
test('ao-star 返回有限代价', () => assert.equal(aoStarSearch(P).cost, 1));
test('ao-star trace 非空', () => assert.ok(buildTrace().length >= 2));
