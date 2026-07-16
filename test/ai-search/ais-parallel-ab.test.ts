import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parallelAlphaBeta,
  type AbNode,
} from '../../src/algorithms/ai-search/ais-parallel-ab/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-parallel-ab/trace.ts';

test('parallel ab 单叶返回 utility', () => {
  const v = parallelAlphaBeta({ id: 'r', utility: 7 }, 3, 2);
  assert.equal(v, 7);
});

test('parallel ab 取子节点最大', () => {
  const t: AbNode = {
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
    ],
  };
  // negamax depth2: root = max(-max(-3,-9), -max(-5,-2)) = max(3, 2) = 3
  const v = parallelAlphaBeta(t, 2, 2);
  assert.equal(v, 3);
});

test('parallel ab workers=1 仍正确', () => {
  const t: AbNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 4 },
      { id: 'b', utility: 6 },
    ],
  };
  assert.equal(parallelAlphaBeta(t, 1, 1), 6);
});

test('parallel ab trace 非空', () => {
  assert.ok(buildTrace().length > 0);
});
