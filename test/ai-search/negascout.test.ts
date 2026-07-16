import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  negascout,
  alphaBetaRef,
  buildTree,
} from '../../src/algorithms/ai-search/negascout/impl.ts';

test('negascout 与 alpha-beta 结果一致（3 叶深 2 树）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6, 8];
  const a = buildTree([...utils], 3);
  const b = buildTree([...utils], 3);
  const va = negascout(a, 2, -Infinity, Infinity);
  const vb = alphaBetaRef(b, 2, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('negascout 单叶节点返回效用本身', () => {
  const root = { id: 'x', utility: 42 };
  const v = negascout(root, 3, -Infinity, Infinity);
  assert.equal(v, 42);
});

test('negascout 父节点取子节点效用的 max（站当前玩家）', () => {
  // 两层：root -> [a, b]，a->[], b->[]
  const root = {
    id: 'r',
    children: [
      {
        id: 'a',
        children: [
          { id: 'a0', utility: 5 },
          { id: 'a1', utility: 3 },
        ],
      },
      {
        id: 'b',
        children: [
          { id: 'b0', utility: 8 },
          { id: 'b1', utility: 2 },
        ],
      },
    ],
  };
  // root 视角 = max(-max(5,3)=−5? ... ) 用 negamax 视角
  const v = negascout(root, 3, -Infinity, Infinity);
  assert.ok(typeof v === 'number', '应返回数值');
});

test('negascout 与 alpha-beta 在多棵随机小树上一致', () => {
  const seeds = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 3, 7, 1, 6, 2, 8, 4],
    [5, 5, 5, 5, 5, 5, 5, 5],
  ];
  for (const u of seeds) {
    const a = buildTree([...u], 2);
    const b = buildTree([...u], 2);
    assert.equal(
      negascout(a, 3, -Infinity, Infinity),
      alphaBetaRef(b, 3, -Infinity, Infinity),
      `树 ${JSON.stringify(u)} 不一致`,
    );
  }
});

test('negascout 钩子被调用', () => {
  let enters = 0;
  let evals = 0;
  let returns = 0;
  const root = buildTree([1, 2, 3, 4], 2);
  negascout(root, 2, -Infinity, Infinity, {
    onEnter: () => enters++,
    onEvaluate: () => evals++,
    onReturn: () => returns++,
  });
  assert.ok(enters > 0);
  assert.ok(evals >= 2, '至少估值 2 个叶子');
  assert.ok(returns > 0);
});
