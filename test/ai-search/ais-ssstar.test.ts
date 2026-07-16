import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sssStar, type SssNode } from '../../src/algorithms/ai-search/ais-ssstar/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ssstar/trace.ts';

test('ais-ssstar 根值等于 minimax', () => {
  const tree: SssNode = {
    id: 'root',
    children: [
      {
        id: 'A',
        children: [
          { id: 'A1', utility: 3 },
          { id: 'A2', utility: 5 },
        ],
      },
      {
        id: 'B',
        children: [
          { id: 'B1', utility: 2 },
          { id: 'B2', utility: 9 },
        ],
      },
    ],
  };
  // 根 MAX: max(min(3,5), min(2,9)) = max(3, 2) = 3
  assert.equal(sssStar(tree), 3);
});

test('ais-ssstar 单叶', () => {
  const tree: SssNode = { id: 'r', utility: 7 };
  assert.equal(sssStar(tree), 7);
});

test('ais-ssstar 深一层', () => {
  const tree: SssNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 4 },
      { id: 'b', utility: 6 },
    ],
  };
  // 根 MAX 取 max = 6
  assert.equal(sssStar(tree), 6);
});

test('ais-ssstar trace', () => {
  assert.ok(buildTrace().length > 2);
});
