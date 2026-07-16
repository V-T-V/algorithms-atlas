import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  iterativeDeepeningAlphaBeta,
  buildDemoTree,
  type AlphaBetaIterativeHooks,
  type IdabNode,
} from '../../src/algorithms/game/alpha-beta-iterative/impl.ts';
import { alphaBeta } from '../../src/algorithms/game/alpha-beta/impl.ts';

const T = (id: string, value: number | undefined, children: IdabNode[] = []): IdabNode => ({
  id,
  value,
  children,
});

test('alpha-beta-iterative 浅层等于深层根值一致（收敛）', () => {
  // 同一棵树，迭代加深到满深度的根值应等于单次完整 alpha-beta
  const tree = buildDemoTree(3, 3);
  const results = iterativeDeepeningAlphaBeta(tree, 3);
  const full = alphaBeta(toGameNode(tree));
  // 最深层结果应与完整 alpha-beta 相同
  const last = results[results.length - 1]!;
  assert.equal(last.value, full.value);
});

test('alpha-beta-iterative 逐层记录 depth 1..D', () => {
  const tree = buildDemoTree(2, 4);
  const results = iterativeDeepeningAlphaBeta(tree, 4);
  assert.equal(results.length, 4);
  assert.deepEqual(
    results.map((r) => r.depth),
    [1, 2, 3, 4],
  );
});

test('alpha-beta-iterative 单节点树', () => {
  const leaf = T('leaf', 7, []);
  const results = iterativeDeepeningAlphaBeta(leaf, 3);
  // 每层都返回叶子值
  for (const r of results) {
    assert.equal(r.value, 7);
    assert.equal(r.bestChildId, null);
  }
});

test('alpha-beta-iterative 手工树：MAX(root)→MIN→叶子', () => {
  // root(MAX) → [m1(MIN)→[3,5], m2(MIN)→[2,9], m3(MIN)→[3,1]]
  // 满深：m1=3, m2=2, m3=1 → root=max=3，best=m1
  const tree: IdabNode = {
    id: 'root',
    children: [
      { id: 'm1', children: [T('a', 3), T('b', 5)] },
      { id: 'm2', children: [T('c', 2), T('d', 9)] },
      { id: 'm3', children: [T('e', 3), T('f', 1)] },
    ],
  };
  const results = iterativeDeepeningAlphaBeta(tree, 2);
  // depth=1：root 直接是叶子？不，depth=1 表示展开 1 层 → 但 m1 等无 value
  // 我们用 depth=2 的完整结果
  const full = results[results.length - 1]!;
  assert.equal(full.value, 3);
  assert.equal(full.bestChildId, 'm1');
  assert.ok(full.prunes >= 1, '应至少 1 次剪枝（m2 看到叶子 2 后剪掉 9）');
});

test('alpha-beta-iterative 钩子被调用', () => {
  let starts = 0;
  let ends = 0;
  let prunes = 0;
  const hooks: AlphaBetaIterativeHooks = {
    onIterationStart: () => starts++,
    onIterationEnd: () => ends++,
    onPrune: () => prunes++,
  };
  const tree = buildDemoTree(3, 3);
  iterativeDeepeningAlphaBeta(tree, 3, hooks);
  assert.equal(starts, 3);
  assert.equal(ends, 3);
});

test('alpha-beta-iterative maxDepth=0 仍返回空', () => {
  const tree = buildDemoTree(2, 2);
  assert.deepEqual(iterativeDeepeningAlphaBeta(tree, 0), []);
});

/** IdabNode → GameNode（alpha-beta 的类型）适配。 */
function toGameNode(n: IdabNode): import('../../src/algorithms/game/alpha-beta/impl.ts').GameNode {
  return {
    id: n.id,
    value: n.value,
    children: n.children.map(toGameNode),
  };
}
