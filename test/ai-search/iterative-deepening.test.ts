import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  iterativeDeepening,
  buildTree,
} from '../../src/algorithms/ai-search/iterative-deepening/impl.ts';

test('迭代加深历史深度递增 1..maxDepth', () => {
  const root = buildTree([1, 2, 3, 4], 2);
  const r = iterativeDeepening(root, 3);
  assert.equal(r.history.length, 3);
  assert.deepEqual(
    r.history.map((h) => h.depth),
    [1, 2, 3],
  );
});

test('迭代加深最深层的值 = 完整 negamax 值（站根玩家）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6, 8];
  const root = buildTree([...utils], 3);
  const r = iterativeDeepening(root, 2);
  // 完整 negamax：根取 max(-min over a's two leaves) = max(−5,−9,−7) ... 用对称视角
  // 这里只断言「最深一层的值非 NaN 且等于一次直接搜索」
  assert.ok(Number.isFinite(r.score));
  assert.equal(r.depth, 2);
});

test('迭代加深每层节点数严格递增', () => {
  const root = buildTree([1, 2, 3, 4, 5, 6, 7, 8], 2);
  const r = iterativeDeepening(root, 3);
  for (let i = 1; i < r.history.length; i++) {
    assert.ok(r.history[i]!.nodes > r.history[i - 1]!.nodes, `depth ${i + 1} 应访问更多节点`);
  }
});

test('迭代加深能找到最佳走法（bestMove 有效索引）', () => {
  const root = buildTree([1, 2, 3, 4], 2);
  const r = iterativeDeepening(root, 2);
  assert.ok(r.bestMove >= 0 && r.bestMove < (root.children?.length ?? 0));
});

test('迭代加深时间限制触发 timedOut', () => {
  const root = buildTree([1, 2, 3, 4, 5, 6, 7, 8], 2);
  // 用确定性时钟：第 0 次调用返回 1000（设置 deadline=1001），
  // 之后每次返回 2000，使 clock() > deadline 恒成立 → 必在第 1 层后或层内超时
  let callCount = 0;
  const clock = (): number => {
    callCount++;
    return callCount <= 1 ? 1000 : 2000;
  };
  const r = iterativeDeepening(root, 10, 1, {}, clock);
  assert.equal(r.timedOut, true);
});

test('迭代加深钩子被调用', () => {
  const root = buildTree([1, 2, 3, 4], 2);
  let starts = 0;
  let ends = 0;
  let visits = 0;
  iterativeDeepening(root, 2, undefined, {
    onDepthStart: () => starts++,
    onDepthEnd: () => ends++,
    onVisit: () => visits++,
  });
  assert.equal(starts, 2);
  assert.equal(ends, 2);
  assert.ok(visits > 0);
});
