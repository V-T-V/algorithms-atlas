import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  negamax,
  solve,
  hasWon,
  isFull,
  type TttNode,
} from '../../src/algorithms/ai-search/negamax/impl.ts';

test('negamax 空棋盘必平（完美对弈）', () => {
  const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const { value } = solve(board, 1);
  assert.equal(value, 0, '空棋盘双方最优应为平局');
});

test('negamax X 立即必胜（已有双线威胁）', () => {
  // X 在 (0,0) (1,1)，轮到 X 走，下 (2,2) 即胜
  // 同时 X 还可走别处但存在一步胜 → 值为 +1
  const board = [1, 2, 0, 0, 1, 0, 0, 0, 0];
  const { value } = solve(board, 1);
  assert.ok(value! > 0, 'X 有一步胜 → +值');
});

test('negamax hasWon 检测行胜利', () => {
  assert.ok(hasWon([1, 1, 1, 0, 0, 0, 0, 0, 0], 1));
  assert.ok(!hasWon([1, 1, 0, 0, 0, 0, 0, 0, 0], 1));
});

test('negamax hasWon 检测对角胜利', () => {
  assert.ok(hasWon([2, 0, 0, 0, 2, 0, 0, 0, 2], 2));
});

test('negamax isFull 检测', () => {
  assert.ok(isFull([1, 2, 1, 2, 1, 1, 1, 2, 2]));
  assert.ok(!isFull([1, 2, 1, 2, 0, 1, 1, 2, 2]));
});

test('negamax 钩子被调用', () => {
  let evals = 0;
  let returns = 0;
  const root: TttNode = { board: [1, 0, 0, 0, 1, 0, 0, 0, 0], player: 2 };
  negamax(root, 5, 1, {
    onEvaluate: () => evals++,
    onReturn: () => returns++,
  });
  assert.ok(evals > 0);
  assert.ok(returns > 0);
});

test('negamax 终局：X 已胜则返回 -1（站在 O 视角）', () => {
  // X 已连成一行，轮到 O → O 已输
  const root: TttNode = {
    board: [1, 1, 1, 2, 0, 0, 0, 0, 0],
    player: 2,
  };
  const v = negamax(root, 5, 1);
  assert.equal(v, -1);
});
