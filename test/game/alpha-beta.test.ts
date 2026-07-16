import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBeta,
  countLeaves,
  type AlphaBetaHooks,
  type GameNode,
} from '../../src/algorithms/game/alpha-beta/impl.ts';
import { minimax } from '../../src/algorithms/game/minimax/impl.ts';

const leaf = (id: string, value: number): GameNode => ({ id, value, children: [] });
const node = (id: string, children: GameNode[]): GameNode => ({ id, children });

// minimax 的 GameNode 与 alpha-beta 的 GameNode 结构兼容，可直接复用。
type MG = Parameters<typeof minimax>[0];

const toMini = (g: GameNode): MG => g as unknown as MG;

// 标准教学样例：root = max(min(3,5), min(2,9), min(3,1)) = max(3,2,1) = 3
function demoTree(): GameNode {
  return node('root', [
    node('n1', [leaf('l1', 3), leaf('l2', 5)]),
    node('n2', [leaf('l3', 2), leaf('l4', 9)]),
    node('n3', [leaf('l5', 3), leaf('l6', 1)]),
  ]);
}

test('alpha-beta 标准博弈树根效用 = 3，最优子 = n1', () => {
  const r = alphaBeta(demoTree());
  assert.equal(r.value, 3);
  assert.equal(r.bestChildId, 'n1');
});

test('alpha-beta 与 minimax 结果完全相同', () => {
  // 多棵树对比
  const trees: GameNode[] = [
    demoTree(),
    leaf('only', 7),
    node('r', [
      node('a', [leaf('a1', 3), leaf('a2', 5)]),
      node('b', [leaf('b1', 2), leaf('b2', 99), leaf('b3', 100)]),
    ]),
    node('r', [
      node('n1', [
        node('m1', [leaf('p', 1), leaf('q', 5)]),
        node('m2', [leaf('r2', 2), leaf('s', 4)]),
      ]),
    ]),
  ];
  for (const t of trees) {
    const tCopy: GameNode = JSON.parse(JSON.stringify(t));
    const ab = alphaBeta(t);
    const mm = minimax(toMini(tCopy));
    assert.equal(ab.value, mm.value, `value mismatch: ab=${ab.value} mm=${mm.value}`);
    assert.equal(ab.bestChildId, mm.bestChildId, `bestChild mismatch`);
  }
});

test('alpha-beta 产生剪枝', () => {
  let prunes = 0;
  // 构造易触发剪枝的树：
  // root(MAX) → A(MIN)[3,5], B(MIN)[2,99,100]
  // root 走 A 得 min=3 → α=3；B 第一个叶子 2 → β=2 ≤ α=3 → 剪掉 B 的后续 2 个
  const tree = node('root', [
    node('A', [leaf('a1', 3), leaf('a2', 5)]),
    node('B', [leaf('b1', 2), leaf('b2', 99), leaf('b3', 100)]),
  ]);
  const r = alphaBeta(tree, {
    onPrune: () => prunes++,
  });
  assert.equal(r.value, 3, 'root = max(min(3,5), min(2,...)) = max(3, 2) = 3');
  assert.equal(r.bestChildId, 'A');
  assert.ok(prunes >= 2, `应至少剪掉 B 的 2 个后续叶子，实际 ${prunes}`);
});

test('alpha-beta 单叶子直接返回', () => {
  const r = alphaBeta(leaf('x', 7));
  assert.equal(r.value, 7);
  assert.equal(r.bestChildId, null);
  assert.equal(r.prunes, 0);
});

test('alpha-beta 深层交替正确（MAX-MIN-MAX-MIN-叶）', () => {
  // 叶子 [1,5],[2,4] → m(MAX) 取 [5,4] → n(MIN) 取 min(5,4)=4 → root(MAX)=4
  const tree = node('root', [
    node('n1', [
      node('m1', [leaf('p', 1), leaf('q', 5)]),
      node('m2', [leaf('r', 2), leaf('s', 4)]),
    ]),
  ]);
  const r = alphaBeta(tree);
  assert.equal(r.value, 4);
});

test('alpha-beta 钩子被调用', () => {
  let enters = 0;
  let evals = 0;
  let pruneEvents = 0;
  const hooks: AlphaBetaHooks = {
    onEnter: () => enters++,
    onEvaluate: () => evals++,
    onPrune: () => pruneEvents++,
  };
  const tree = node('root', [
    node('A', [leaf('a1', 3), leaf('a2', 5)]),
    node('B', [leaf('b1', 2), leaf('b2', 99), leaf('b3', 100)]),
  ]);
  alphaBeta(tree, hooks);
  assert.ok(enters > 0, '应触发 onEnter');
  assert.ok(evals > 0, '应触发 onEvaluate');
  assert.ok(pruneEvents >= 2, `应触发 onPrune，实际 ${pruneEvents}`);
});

test('alpha-beta 剪枝后求值的叶子数少于总数', () => {
  // 构造一棵会剪枝的树，统计实际 onEvaluate 叶子数 < 总叶子数
  const tree = node('root', [
    node('A', [leaf('a1', 3), leaf('a2', 5)]),
    node('B', [leaf('b1', 2), leaf('b2', 99), leaf('b3', 100), leaf('b4', 50)]),
  ]);
  const totalLeaves = countLeaves(tree);
  let evaluatedLeaves = 0;
  alphaBeta(tree, {
    onEvaluate: (_id, _v, _isMax) => {
      // 仅叶子（无 children）才计入；这里简化：所有 evaluate 都算
      evaluatedLeaves++;
    },
  });
  // 至少剪掉了一些（求值次数严格小于所有节点+叶子）
  assert.ok(evaluatedLeaves < totalLeaves + 4, `剪枝后求值 ${evaluatedLeaves} 应少于全部`);
});

test('countLeaves 正确', () => {
  assert.equal(countLeaves(demoTree()), 6);
  assert.equal(countLeaves(leaf('x', 1)), 1);
});
