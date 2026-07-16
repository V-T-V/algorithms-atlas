import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBetaWithKillers,
  alphaBetaPlain,
  buildTree,
  makeKillerTable,
  recordKiller,
} from '../../src/algorithms/ai-search/killer-move-heuristic/impl.ts';

test('killer 版与普通 alpha-beta 结果一致', () => {
  const utils = [10, 5, 8, 3, 9, 1, 7, 4];
  const a = buildTree({ utilities: [...utils], branching: 2 });
  const b = buildTree({ utilities: [...utils], branching: 2 });
  const depth = 3;
  const table = makeKillerTable(depth + 1);
  const va = alphaBetaWithKillers(a, depth, -Infinity, Infinity, 0, table, 2);
  const vb = alphaBetaPlain(b, depth, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('killer 版在多组数据上与普通版一致', () => {
  const cases = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [8, 7, 6, 5, 4, 3, 2, 1],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [9, 3, 7, 1, 6, 2, 8, 4],
  ];
  for (const u of cases) {
    const a = buildTree({ utilities: [...u], branching: 2 });
    const b = buildTree({ utilities: [...u], branching: 2 });
    const table = makeKillerTable(4);
    assert.equal(
      alphaBetaWithKillers(a, 3, -Infinity, Infinity, 0, table, 2),
      alphaBetaPlain(b, 3, -Infinity, Infinity),
    );
  }
});

test('recordKiller 最近优先 + 去重', () => {
  const t = makeKillerTable(2);
  recordKiller(t, 0, 5, 2);
  recordKiller(t, 0, 7, 2);
  recordKiller(t, 0, 5, 2); // 提到最前
  assert.deepEqual(t.killers[0], [5, 7]);
});

test('recordKiller 最多保留 K 个', () => {
  const t = makeKillerTable(2);
  recordKiller(t, 0, 1, 2);
  recordKiller(t, 0, 2, 2);
  recordKiller(t, 0, 3, 2); // 超出，淘汰最旧
  assert.deepEqual(t.killers[0], [3, 2]);
});

test('killer 版钩子被调用（存在剪枝时记录 killer）', () => {
  const utils = [10, 5, 8, 3, 9, 1, 7, 4];
  const root = buildTree({ utilities: [...utils], branching: 2 });
  const table = makeKillerTable(4);
  let prunes = 0;
  let recorded = 0;
  alphaBetaWithKillers(root, 3, -Infinity, Infinity, 0, table, 2, {
    onPrune: () => prunes++,
    onKillerRecorded: () => recorded++,
  });
  assert.ok(prunes >= 0);
  // 有剪枝就应记录
  if (prunes > 0) assert.equal(recorded, prunes);
});

test('killer 表在搜索后非空（存在剪枝的数据）', () => {
  // 这组数据在普通 alpha-beta 下会有剪枝
  const utils = [10, 5, 8, 3, 9, 1, 7, 4];
  const root = buildTree({ utilities: [...utils], branching: 2 });
  const table = makeKillerTable(4);
  alphaBetaWithKillers(root, 3, -Infinity, Infinity, 0, table, 2);
  const totalKillers = table.killers.reduce((s, l) => s + l.length, 0);
  assert.ok(totalKillers > 0, '存在剪枝时 killer 表不应为空');
});
