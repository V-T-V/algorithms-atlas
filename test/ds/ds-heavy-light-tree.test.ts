import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HeavyLightDecomposition } from '../../src/algorithms/ds/ds-heavy-light-tree/impl.ts';

const naiveLca = (
  n: number,
  edges: Array<[number, number]>,
  root: number,
  u: number,
  v: number,
): number => {
  const adj = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of edges) {
    adj[a]!.push(b);
    adj[b]!.push(a);
  }
  const parent = new Array<number>(n).fill(-1);
  const depth = new Array<number>(n).fill(0);
  const dfs = (x: number, p: number): void => {
    parent[x] = p;
    for (const y of adj[x]!) {
      if (y !== p) {
        depth[y] = depth[x]! + 1;
        dfs(y, x);
      }
    }
  };
  dfs(root, -1);
  while (u !== v) {
    if (depth[u]! > depth[v]!) u = parent[u]!;
    else v = parent[v]!;
  }
  return u;
};

test('HLD 基本树 LCA', () => {
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [4, 8],
  ];
  const hld = new HeavyLightDecomposition({ n: 9, edges, root: 0 });
  assert.equal(hld.lca(7, 6), 0);
  assert.equal(hld.lca(7, 8), 4);
  assert.equal(hld.lca(3, 7), 1);
  assert.equal(hld.lca(5, 6), 2);
});

test('HLD 自身 LCA', () => {
  const hld = new HeavyLightDecomposition({
    n: 3,
    edges: [
      [0, 1],
      [0, 2],
    ],
    root: 0,
  });
  assert.equal(hld.lca(1, 1), 1);
  assert.equal(hld.lca(0, 0), 0);
});

test('HLD 链状树', () => {
  const edges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  const hld = new HeavyLightDecomposition({ n: 5, edges, root: 0 });
  assert.equal(hld.lca(0, 4), 0);
  assert.equal(hld.lca(4, 0), 0);
  assert.equal(hld.lca(2, 4), 2);
});

test('HLD 单节点', () => {
  const hld = new HeavyLightDecomposition({ n: 1, edges: [], root: 0 });
  assert.equal(hld.lca(0, 0), 0);
});

test('HLD size/depth/dfn 正确', () => {
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
  ];
  const hld = new HeavyLightDecomposition({ n: 4, edges, root: 0 });
  assert.equal(hld.size[0], 4);
  assert.equal(hld.size[3], 1);
  assert.equal(hld.depth[0], 0);
  assert.equal(hld.depth[3], 2);
  // dfn 应是 0..n-1 的排列
  const dfns = [...hld.dfn].sort((a, b) => a - b);
  assert.deepEqual(dfns, [0, 1, 2, 3]);
});

test('HLD pathChainCount', () => {
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
  ];
  const hld = new HeavyLightDecomposition({ n: 5, edges, root: 0 });
  // 路径 3-4：3→1→4，若 1-3、1-4 是不同重链则 2 段以上
  const cnt = hld.pathChainCount(3, 4);
  assert.ok(cnt >= 1);
});

test('HLD 与朴素 LCA 对照（较大树）', () => {
  const n = 20;
  const edges: Array<[number, number]> = [];
  for (let i = 1; i < n; i++) edges.push([Math.floor(i / 2), i]);
  const hld = new HeavyLightDecomposition({ n, edges, root: 0 });
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      assert.equal(hld.lca(u, v), naiveLca(n, edges, 0, u, v), `LCA(${u},${v})`);
    }
  }
});
