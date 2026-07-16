import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBetaWithHistory,
  alphaBetaPlain,
  buildTree,
  makeHistoryTable,
  recordCutoff,
  historyScore,
} from '../../src/algorithms/ai-search/history-heuristic/impl.ts';

test('history-heuristic 与纯 alpha-beta 根值一致（3 叉深 2）', () => {
  const utils = [3, 12, 8, 2, 4, 6, 14, 10, 5];
  const a = buildTree({ utilities: utils, branching: 3 });
  const b = buildTree({ utilities: utils, branching: 3 });
  const t = makeHistoryTable();
  const va = alphaBetaWithHistory(a, 2, -Infinity, Infinity, 0, t, null);
  const vb = alphaBetaPlain(b, 2, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('history-heuristic 在多棵随机小树上与 alpha-beta 一致', () => {
  const cases = [
    [1, 2, 3, 4],
    [9, 3, 7, 1, 6, 2, 8, 4],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [10, 2, 8, 4, 6, 1, 9, 3, 7, 5, 0, 11, 13, 12, 14, 15],
  ];
  for (const u of cases) {
    const br =
      u.length === 4 ? 2 : u.length === 8 ? 2 : u.length === 12 ? 3 : u.length === 16 ? 4 : 2;
    const a = buildTree({ utilities: u, branching: br });
    const b = buildTree({ utilities: u, branching: br });
    const t = makeHistoryTable();
    const va = alphaBetaWithHistory(
      a,
      Math.round(Math.log(u.length) / Math.log(br)),
      -Infinity,
      Infinity,
      0,
      t,
      null,
    );
    const vb = alphaBetaPlain(
      b,
      Math.round(Math.log(u.length) / Math.log(br)),
      -Infinity,
      Infinity,
    );
    assert.equal(va, vb, `tree ${JSON.stringify(u)} mismatch`);
  }
});

test('history-heuristic 单叶子返回效用', () => {
  const root = { id: 'x', utility: 42 };
  const t = makeHistoryTable();
  assert.equal(alphaBetaWithHistory(root, 3, -Infinity, Infinity, 0, t, null), 42);
});

test('recordCutoff 按深度平方累加', () => {
  const t = makeHistoryTable();
  recordCutoff(t, 1, 2, 3);
  recordCutoff(t, 1, 2, 3);
  recordCutoff(t, 1, 2, 1);
  assert.equal(historyScore(t, 1, 2), 9 + 9 + 1);
});

test('history-heuristic 剪枝会写入 history 表', () => {
  // 构造一棵会发生剪枝的树
  const u = [10, 1, 1, 1, 1, 1, 1, 1];
  const a = buildTree({ utilities: u, branching: 2 });
  const t = makeHistoryTable();
  let prunes = 0;
  alphaBetaWithHistory(a, 3, -Infinity, Infinity, 0, t, null, {
    onPrune: () => prunes++,
  });
  assert.ok(prunes >= 1, '应有剪枝事件');
  assert.ok(t.scores.size >= 1, 'history 表应有记录');
});

test('history-heuristic 钩子被调用', () => {
  const a = buildTree({ utilities: [1, 2, 3, 4], branching: 2 });
  const t = makeHistoryTable();
  let visits = 0;
  let orders = 0;
  alphaBetaWithHistory(a, 2, -Infinity, Infinity, 0, t, null, {
    onVisit: () => visits++,
    onOrder: () => orders++,
  });
  assert.ok(visits > 0);
  assert.ok(orders > 0);
});
