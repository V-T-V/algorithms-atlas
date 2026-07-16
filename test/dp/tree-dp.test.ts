import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treeDp, type TreeDpInput } from '../../src/algorithms/dp/tree-dp/impl.ts';

/** 校验：被选节点集两两不相邻。 */
function isIndependentSet(input: TreeDpInput, picked: string[]): boolean {
  // 构造父→子与子→父邻接
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n.id, new Set());
  for (const n of input.nodes) {
    for (const c of n.children ?? []) {
      adj.get(n.id)!.add(c);
      adj.get(c)!.add(n.id);
    }
  }
  const set = new Set(picked);
  for (const u of picked) {
    for (const v of adj.get(u) ?? []) {
      if (set.has(v)) return false;
    }
  }
  return true;
}

const TREE: TreeDpInput = {
  root: '1',
  nodes: [
    { id: '1', weight: 3, children: ['2', '3'] },
    { id: '2', weight: 2, children: ['4', '5'] },
    { id: '3', weight: 5, children: ['6'] },
    { id: '4', weight: 1 },
    { id: '5', weight: 4 },
    { id: '6', weight: 1 },
  ],
};

test('tree-dp 最大权独立集权和正确', () => {
  // 手算最优：选 {3,4,5} = 5+1+4 = 10
  const r = treeDp(TREE);
  assert.equal(r.maxWeight, 10);
});

test('tree-dp 选中集是独立集', () => {
  const r = treeDp(TREE);
  assert.ok(isIndependentSet(TREE, r.picked), '选中集含相邻节点');
  // 权和应等于 maxWeight
  const w = r.picked.reduce((acc, id) => acc + TREE.nodes.find((n) => n.id === id)!.weight, 0);
  assert.equal(w, r.maxWeight);
});

test('tree-dp 单节点', () => {
  const r = treeDp({ root: 'A', nodes: [{ id: 'A', weight: 7 }] });
  assert.equal(r.maxWeight, 7);
  assert.deepEqual(r.picked, ['A']);
});

test('tree-dp 负权也能正确剪枝（选不选看净收益）', () => {
  // 链 A(-5) -> B(3)；选 B 更优 = 3
  const r = treeDp({
    root: 'A',
    nodes: [
      { id: 'A', weight: -5, children: ['B'] },
      { id: 'B', weight: 3 },
    ],
  });
  assert.equal(r.maxWeight, 3);
});

test('tree-dp 星形：选根或选所有叶子', () => {
  // 中心 C(10) 连 3 个叶子各 4：选 C=10 vs 选叶子 4+4+4=12
  const r = treeDp({
    root: 'C',
    nodes: [
      { id: 'C', weight: 10, children: ['L1', 'L2', 'L3'] },
      { id: 'L1', weight: 4 },
      { id: 'L2', weight: 4 },
      { id: 'L3', weight: 4 },
    ],
  });
  assert.equal(r.maxWeight, 12);
  assert.deepEqual(r.picked.sort(), ['L1', 'L2', 'L3']);
});

test('tree-dp 钩子被调用', () => {
  const solved: string[] = [];
  let doneWeight = -1;
  treeDp(TREE, {
    onSolve: (u) => solved.push(u),
    onDone: (mw) => {
      doneWeight = mw;
    },
  });
  assert.equal(solved.length, 6, '每个节点都应求出 dp 值');
  assert.equal(doneWeight, 10);
});
