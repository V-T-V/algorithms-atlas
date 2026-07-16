import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minimax,
  solve,
  type GameNode,
} from '../../src/algorithms/ai-search/minimax-search/impl.ts';

test('minimax 单堆 [1] MAX 必胜', () => {
  // MAX 取走最后一颗 → 终局且当前（MIN）无路 → 返回给 MAX 的是 +1
  const root: GameNode = { state: [1], player: 'max' };
  const v = minimax(root, 5, true);
  assert.equal(v, 1);
});

test('minimax 单堆 [2] MAX 必胜（取 1 后 MIN 必输）', () => {
  const root: GameNode = { state: [2], player: 'max' };
  const v = minimax(root, 5, true);
  assert.equal(v, 1);
});

test('minimax 空堆 [0] MAX 已输（无棋可走）', () => {
  // state 全 0 → 终局，取走最后一颗的是对方 → MAX 输 → -1
  const root: GameNode = { state: [0], player: 'max' };
  const v = minimax(root, 5, true);
  assert.equal(v, -1);
});

test('minimax [3,2] MAX 必胜（Nim-和 1≠0）', () => {
  const { value } = solve([3, 2], 6);
  assert.ok(value! > 0, 'Nim-和 ≠ 0 时先手必胜');
});

test('minimax 对称局面 [1,1] 后手必胜（Nim-和 0）', () => {
  const { value } = solve([1, 1], 6);
  assert.ok(value! < 0, 'Nim-和 = 0 时先手必败');
});

test('minimax 钩子被调用且终态有根值', () => {
  let evals = 0;
  let returns = 0;
  const root: GameNode = { state: [2, 1], player: 'max' };
  minimax(root, 5, true, {
    onEvaluate: () => evals++,
    onReturn: () => returns++,
  });
  assert.ok(evals > 0, '至少估值一次叶子');
  assert.ok(returns > 0, '至少一次内部返回');
  assert.ok(root.value !== undefined, '根值被填充');
});
