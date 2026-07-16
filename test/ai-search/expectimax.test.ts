import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  expectimax,
  buildDiceTree,
  type ExpectNode,
} from '../../src/algorithms/ai-search/expectimax/impl.ts';

test('expectimax 骰子游戏：掷的期望 = (3+6+0)/3 = 3 < 停的 5 → 根 = 5', () => {
  const root = buildDiceTree();
  const v = expectimax(root, 5);
  assert.equal(v, 5);
});

test('expectimax 纯叶子 = utility', () => {
  const leaf: ExpectNode = { id: 'x', kind: 'leaf', utility: 42 };
  assert.equal(expectimax(leaf, 3), 42);
});

test('expectimax MAX 节点取最大', () => {
  const node: ExpectNode = {
    id: 'm',
    kind: 'max',
    children: [
      { id: 'a', kind: 'leaf', utility: 3 },
      { id: 'b', kind: 'leaf', utility: 7 },
      { id: 'c', kind: 'leaf', utility: 5 },
    ],
  };
  assert.equal(expectimax(node, 3), 7);
});

test('expectimax CHANCE 节点取加权平均', () => {
  const node: ExpectNode = {
    id: 'ch',
    kind: 'chance',
    probabilities: [0.5, 0.5],
    children: [
      { id: 'a', kind: 'leaf', utility: 2 },
      { id: 'b', kind: 'leaf', utility: 8 },
    ],
  };
  assert.equal(expectimax(node, 3), 5);
});

test('expectimax CHANCE 均匀分布（无 probabilities）= 算术平均', () => {
  const node: ExpectNode = {
    id: 'ch',
    kind: 'chance',
    children: [
      { id: 'a', kind: 'leaf', utility: 0 },
      { id: 'b', kind: 'leaf', utility: 3 },
      { id: 'c', kind: 'leaf', utility: 6 },
    ],
  };
  assert.equal(expectimax(node, 3), 3);
});

test('expectimax 嵌套：MAX over (CHANCE, leaf) 计算正确', () => {
  // max( chance(0.5*2 + 0.5*4 = 3), leaf 1 ) = 3
  const root: ExpectNode = {
    id: 'r',
    kind: 'max',
    children: [
      {
        id: 'c1',
        kind: 'chance',
        probabilities: [0.5, 0.5],
        children: [
          { id: 'a', kind: 'leaf', utility: 2 },
          { id: 'b', kind: 'leaf', utility: 4 },
        ],
      },
      { id: 'l', kind: 'leaf', utility: 1 },
    ],
  };
  assert.equal(expectimax(root, 4), 3);
});

test('expectimax 钩子被调用', () => {
  let evals = 0;
  let returns = 0;
  const root = buildDiceTree();
  expectimax(root, 5, {
    onEvaluate: () => evals++,
    onReturn: () => returns++,
  });
  assert.ok(evals > 0);
  assert.ok(returns > 0);
});
