import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heavyLightDecomposition,
  decomposePath,
  type TreeInput,
} from '../../src/algorithms/graph/heavy-light-decomposition-impl/impl.ts';

const T: TreeInput = {
  nodes: ['0', '1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '0', to: '3' },
    { from: '1', to: '4' },
    { from: '1', to: '5' },
    { from: '3', to: '6' },
    { from: '4', to: '7' },
  ],
  root: '0',
};

test('hld size 之根最大', () => {
  const { size } = heavyLightDecomposition(T);
  assert.equal(size.get('0'), 8); // 全部 8 个节点
});

test('hld heavy 子是最大子', () => {
  const { heavy, size } = heavyLightDecomposition(T);
  // 0 的子树大小 1, 1, 2（节点 3 子树含 6）-> heavy 是 1（含 1,4,5,7 = 4）
  const h0 = heavy.get('0');
  assert.ok(h0 !== null);
  // heavy 子应是其兄弟中 size 最大者
  const children = ['1', '2', '3'];
  let maxSize = -1;
  let maxChild = '';
  for (const c of children) {
    if ((size.get(c) ?? 0) > maxSize) {
      maxSize = size.get(c)!;
      maxChild = c;
    }
  }
  assert.equal(h0, maxChild);
});

test('hld 同一重链 top 相同', () => {
  const { top, heavy } = heavyLightDecomposition(T);
  void heavy;
  // 2 是叶子轻子，top 是自己
  assert.equal(top.get('2'), '2');
  assert.equal(top.get('5'), '5');
  // top 字段都存在
  for (const n of T.nodes) assert.ok(top.has(n));
});

test('hld dfn 每条重链连续', () => {
  const { dfn, top, heavy } = heavyLightDecomposition(T);
  // 沿根的重链走，dfn 应递增连续
  let cur = '0';
  let prev = dfn.get(cur)!;
  while (heavy.get(cur)) {
    cur = heavy.get(cur)!;
    const d = dfn.get(cur)!;
    assert.equal(d, prev + 1, `chain ${cur} dfn should be contiguous`);
    assert.equal(top.get(cur), '0');
    prev = d;
  }
});

test('hld decomposePath 父子路径单区间', () => {
  const info = heavyLightDecomposition(T);
  const ranges = decomposePath(info, '0', '0');
  assert.equal(ranges.length, 1);
  assert.equal(ranges[0]!.lo, ranges[0]!.hi);
});

test('hld decomposePath 跨链多区间', () => {
  const info = heavyLightDecomposition(T);
  const ranges = decomposePath(info, '7', '6');
  // 路径一定经过根，至少 2 段
  assert.ok(ranges.length >= 2);
  // 区间总长 = 路径节点数（7-4-1-0-3-6 = 6 节点）
  const total = ranges.reduce((s, r) => s + (r.hi - r.lo + 1), 0);
  assert.equal(total, 6);
});

test('hld 钩子被调用', () => {
  let dfs1Calls = 0;
  let dfs2Calls = 0;
  heavyLightDecomposition(T, {
    onDfs1: () => dfs1Calls++,
    onDfs2: () => dfs2Calls++,
  });
  assert.equal(dfs1Calls, 8);
  assert.equal(dfs2Calls, 8);
});
