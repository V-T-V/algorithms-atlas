import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scpsEvaluate, type ScpsNode } from '../../src/algorithms/ai-search/ais-scps/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-scps/trace.ts';

test('ais-scps 叶子分布取期望', () => {
  const leaf: ScpsNode = {
    id: 'L',
    type: 'leaf',
    dist: [
      { value: 10, prob: 0.5 },
      { value: 2, prob: 0.5 },
    ],
  };
  assert.equal(scpsEvaluate(leaf), 6);
});

test('ais-scps chance 节点加权', () => {
  const node: ScpsNode = {
    id: 'C',
    type: 'chance',
    probs: [0.5, 0.5],
    children: [
      { id: 'a', type: 'leaf', utility: 10 },
      { id: 'b', type: 'leaf', utility: 2 },
    ],
  };
  assert.equal(scpsEvaluate(node), 6);
});

test('ais-scps max 节点取最大', () => {
  const node: ScpsNode = {
    id: 'M',
    type: 'max',
    children: [
      { id: 'a', type: 'leaf', utility: 3 },
      { id: 'b', type: 'leaf', utility: 7 },
    ],
  };
  assert.equal(scpsEvaluate(node), 7);
});

test('ais-scps 完整树', () => {
  const tree: ScpsNode = {
    id: 'root',
    type: 'max',
    children: [
      {
        id: 'C',
        type: 'chance',
        probs: [0.5, 0.5],
        children: [
          { id: 'a', type: 'leaf', utility: 10 },
          { id: 'b', type: 'leaf', utility: 2 },
        ],
      },
      { id: 'd', type: 'leaf', utility: 4 },
    ],
  };
  // chance = 6, leaf=4, max(6,4)=6
  assert.equal(scpsEvaluate(tree), 6);
});

test('ais-scps trace', () => {
  assert.ok(buildTrace().length > 2);
});
