import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softSearch, type SPNode } from '../../src/algorithms/ai-search/ais-soft-pruning/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-soft-pruning/trace.ts';

test('soft prune 多层树正确', () => {
  // negamax depth=2: root=max(-max(-3,-9), -max(-5,-2), -max(-7,-1)) = max(3,2,1) = 3
  const t: SPNode = {
    id: 'r',
    children: [
      {
        id: 'a',
        children: [
          { id: 'a1', utility: 3 },
          { id: 'a2', utility: 9 },
        ],
      },
      {
        id: 'b',
        children: [
          { id: 'b1', utility: 5 },
          { id: 'b2', utility: 2 },
        ],
      },
      {
        id: 'c',
        children: [
          { id: 'c1', utility: 7 },
          { id: 'c2', utility: 1 },
        ],
      },
    ],
  };
  assert.equal(softSearch(t, 2, 2), 3);
});
test('soft prune 单叶', () => {
  assert.equal(softSearch({ id: 'r', utility: 4 }, 2, 3), 4);
});
test('soft prune trace 非空', () => assert.ok(buildTrace().length > 0));
