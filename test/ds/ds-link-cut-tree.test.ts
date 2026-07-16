import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LinkCutTree } from '../../src/algorithms/ds/ds-link-cut-tree/impl.ts';

test('LCT 初始全不连通', () => {
  const lct = new LinkCutTree(5);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++) {
      if (i === j) assert.equal(lct.connected(i, j), true);
      else assert.equal(lct.connected(i, j), false);
    }
});

test('LCT link 后连通', () => {
  const lct = new LinkCutTree(4);
  assert.equal(lct.link(0, 1), true);
  assert.equal(lct.connected(0, 1), true);
  assert.equal(lct.connected(0, 2), false);
  lct.link(1, 2);
  assert.equal(lct.connected(0, 2), true); // 0-1-2
});

test('LCT link 已连通返回 false', () => {
  const lct = new LinkCutTree(3);
  lct.link(0, 1);
  lct.link(1, 2);
  assert.equal(lct.link(0, 2), false); // 已连通
});

test('LCT cut 断开', () => {
  const lct = new LinkCutTree(4);
  lct.link(0, 1);
  lct.link(1, 2);
  lct.link(2, 3);
  assert.equal(lct.connected(0, 3), true);
  lct.cut(1, 2);
  assert.equal(lct.connected(0, 3), false);
  assert.equal(lct.connected(0, 1), true);
  assert.equal(lct.connected(2, 3), true);
});

test('LCT cut 不存在的边', () => {
  const lct = new LinkCutTree(4);
  lct.link(0, 1);
  assert.equal(lct.cut(0, 2), false); // 边不存在（0、2 不连通）
});

test('LCT findRoot', () => {
  const lct = new LinkCutTree(4);
  lct.link(0, 1);
  lct.link(1, 2);
  // 0、1、2 同树
  const r0 = lct.findRoot(0);
  const r2 = lct.findRoot(2);
  assert.equal(r0, r2);
  // 3 单独
  assert.equal(lct.findRoot(3), 3);
});

test('LCT 与并查集对照（大量操作）', () => {
  const n = 12;
  const lct = new LinkCutTree(n);
  // 用邻接表跟踪实际树
  const adj = Array.from({ length: n }, () => new Set<number>());
  const connectedDSU = (u: number, v: number): boolean => {
    const visited = new Set<number>([u]);
    const queue = [u];
    while (queue.length > 0) {
      const x = queue.shift()!;
      if (x === v) return true;
      for (const y of adj[x]!) {
        if (!visited.has(y)) {
          visited.add(y);
          queue.push(y);
        }
      }
    }
    return false;
  };
  const ops: Array<[string, number, number]> = [
    ['link', 0, 1],
    ['link', 1, 2],
    ['link', 3, 4],
    ['link', 2, 3],
    ['query', 0, 4],
    ['cut', 1, 2],
    ['query', 0, 4],
    ['query', 0, 1],
    ['link', 0, 2],
    ['query', 0, 4],
  ];
  for (const [t, u, v] of ops) {
    if (t === 'link') {
      const expected = !connectedDSU(u, v);
      const r = lct.link(u, v);
      assert.equal(r, expected, `link(${u},${v})`);
      if (r) {
        adj[u]!.add(v);
        adj[v]!.add(u);
      }
    } else if (t === 'cut') {
      const hasEdge = adj[u]!.has(v);
      const r = lct.cut(u, v);
      // cut 成功要求边存在且 u、v 连通（边存在必连通）
      if (hasEdge) {
        assert.equal(r, true, `cut(${u},${v}) should succeed`);
        adj[u]!.delete(v);
        adj[v]!.delete(u);
      } else {
        assert.equal(r, false, `cut(${u},${v}) should fail`);
      }
    } else {
      assert.equal(lct.connected(u, v), connectedDSU(u, v), `connected(${u},${v})`);
    }
  }
});

test('LCT 自连接', () => {
  const lct = new LinkCutTree(3);
  assert.equal(lct.connected(1, 1), true);
  // link(1,1) 应失败（已连通）
  assert.equal(lct.link(1, 1), false);
});
