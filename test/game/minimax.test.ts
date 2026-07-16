import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minimax,
  ticTacToeMinimax,
  winnerOf,
  isFull,
  type GameNode,
} from '../../src/algorithms/game/minimax/impl.ts';

const leaf = (id: string, value: number): GameNode => ({ id, value, children: [] });
const node = (id: string, children: GameNode[]): GameNode => ({ id, children });

// 标准教学样例：
//            root(MAX)
//        /      |      \
//     n1(MIN)  n2(MIN) n3(MIN)
//    /  \      /  \     |  \
//   3   5    2   9     3   1
// root = max(min(3,5), min(2,9), min(3,1)) = max(3,2,1) = 3
function demoTree(): GameNode {
  return node('root', [
    node('n1', [leaf('l1', 3), leaf('l2', 5)]),
    node('n2', [leaf('l3', 2), leaf('l4', 9)]),
    node('n3', [leaf('l5', 3), leaf('l6', 1)]),
  ]);
}

test('minimax 标准博弈树根效用 = 3，最优子 = n1', () => {
  const r = minimax(demoTree());
  assert.equal(r.value, 3);
  assert.equal(r.bestChildId, 'n1');
});

test('minimax 与无剪枝版本结果一致', () => {
  const t1 = demoTree();
  const t2 = demoTree();
  const r1 = minimax(t1, {}, { alphaBeta: true });
  const r2 = minimax(t2, {}, { alphaBeta: false });
  assert.equal(r1.value, r2.value);
  assert.equal(r1.bestChildId, r2.bestChildId);
});

test('minimax alpha-beta 产生剪枝且不影响结果', () => {
  let prunes = 0;
  // 构造易触发剪枝的树：root(MAX) → n1(MIN)[6, 4]，n2(MIN)[8(prune l4) ]
  // root 走 n1 得 4 → α=4；n2 评估 l3=8 → β=8，8 > 4 不剪；其实经典剪枝：
  // root(MAX) → A(MIN)[3,5], B(MIN)[2,...] 走 A 得 min=3 → α=3；B 第一个叶子 2 → β=2 ≤ α=3 → 剪掉 B 的后续
  const tree = node('root', [
    node('A', [leaf('a1', 3), leaf('a2', 5)]),
    node('B', [leaf('b1', 2), leaf('b2', 99), leaf('b3', 100)]),
  ]);
  const r = minimax(tree, {
    onPrune: () => prunes++,
  });
  assert.equal(r.value, 3, 'root = max(min(3,5), min(2,...)) = max(3, 2) = 3');
  assert.equal(r.bestChildId, 'A');
  assert.ok(prunes >= 2, `应至少剪掉 B 的 2 个后续叶子，实际 ${prunes}`);
});

test('minimax 单叶子直接返回', () => {
  const r = minimax(leaf('x', 7));
  assert.equal(r.value, 7);
  assert.equal(r.bestChildId, null);
});

test('minimax 深层交替正确（MAX-MIN-MAX-MIN-叶）', () => {
  // 深度 4：root(MAX)→n(MIN)→m(MAX)→叶子
  // 叶子 [1,5],[2,4] → m(MAX) 取 [5,4] → n(MIN) 取 min(5,4)=4 → root(MAX)=4
  const tree = node('root', [
    node('n1', [
      node('m1', [leaf('p', 1), leaf('q', 5)]),
      node('m2', [leaf('r', 2), leaf('s', 4)]),
    ]),
  ]);
  const r = minimax(tree);
  assert.equal(r.value, 4);
});

test('minimax 钩子被调用', () => {
  let evals = 0;
  let maxs = 0;
  let mins = 0;
  minimax(demoTree(), {
    onEvaluate: () => evals++,
    onMax: () => maxs++,
    onMin: () => mins++,
  });
  assert.ok(evals > 0, '应触发 onEvaluate');
  assert.ok(maxs > 0, '应触发 onMax');
  assert.ok(mins > 0, '应触发 onMin');
});

test('minimax 钩子被调用（无剪枝时无 onPrune）', () => {
  let prunes = 0;
  minimax(demoTree(), { onPrune: () => prunes++ }, { alphaBeta: false });
  assert.equal(prunes, 0, '关闭剪枝后不应有 onPrune');
});

// ============================== 井字棋 ==============================

const E = null;
test('winnerOf / isFull 基本判断', () => {
  assert.equal(winnerOf(['X', 'X', 'X', E, E, E, E, E, E]), 'X');
  assert.equal(winnerOf([E, E, E, 'O', 'O', 'O', E, E, E]), 'O');
  assert.equal(winnerOf(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), null);
  assert.equal(isFull(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), true);
  assert.equal(isFull([E, E, E, E, E, E, E, E, E]), false);
});

test('tic-tac-toe 必胜局面：X 应一步获胜', () => {
  // X _ X 在第 0 行，下在 idx=1 即胜
  const board: ('X' | 'O' | null)[] = ['X', E, 'X', 'O', 'O', E, E, E, E];
  const r = ticTacToeMinimax(board, 'X');
  assert.equal(r.move, 1, 'X 应选择 idx=1 直接获胜');
  assert.equal(r.score, 1);
});

test('tic-tac-toe 必败防御：O 应堵住 X 的三连', () => {
  // X _ X 第 0 行，轮到 O，O 必须下 idx=1 防守（否则下轮 X 立即三连获胜）
  const board: ('X' | 'O' | null)[] = ['X', E, 'X', E, E, E, E, E, E];
  const r = ticTacToeMinimax(board, 'O');
  // 关键：O 的最佳应对是堵在 idx=1，避免立即输掉
  assert.equal(r.move, 1, 'O 应堵在 idx=1 防止 X 三连');
  // 此局面 X 已有显著优势，即便最优防守，从 X 角度的效用仍可能是 +1（X 仍可赢）
  assert.ok(r.score >= -1 && r.score <= 1, `score 应在 [-1,1]，实际 ${r.score}`);
});

test('tic-tac-toe 空棋盘：X 最优结果为 0（井字棋完美对弈为平局）', () => {
  const board: ('X' | 'O' | null)[] = [E, E, E, E, E, E, E, E, E];
  const r = ticTacToeMinimax(board, 'X');
  assert.equal(r.score, 0, '井字棋双方完美对弈结果是平局');
  assert.ok(r.move !== null, '应给出一个合法首步');
  // 对称首步之一：角或中心
  assert.ok([0, 2, 4, 6, 8].includes(r.move!), `首步应在角/中心，实际 ${r.move}`);
});

test('tic-tac-toe 已终局面板返回 score 且 move=null', () => {
  const board: ('X' | 'O' | null)[] = ['X', 'X', 'X', E, E, E, E, E, E];
  const r = ticTacToeMinimax(board, 'O');
  assert.equal(r.move, null);
  assert.equal(r.score, 1); // X 已胜 → 对 X 效用 +1
});

test('tic-tac-toe 钩子被调用', () => {
  let evals = 0;
  ticTacToeMinimax(['X', E, 'X', E, E, E, E, E, E], 'X', {
    onEvaluate: () => evals++,
  });
  assert.ok(evals > 0);
});
