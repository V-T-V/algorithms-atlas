import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  build,
  lca,
  binaryLifting,
  type TreeInput,
} from '../../src/algorithms/design/binary-lifting/impl.ts';

//        R
//       / \
//      A   B
//     / \   \
//    C   D   E
//   /
//  F
const T: TreeInput = {
  nodes: ['R', 'A', 'B', 'C', 'D', 'E', 'F'],
  parents: ['R', 'R', 'R', 'A', 'A', 'B', 'C'],
  root: 'R',
};

test('binary-lifting LCA(C, D) = A', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'C', 'D'), 'A');
});

test('binary-lifting LCA(C, E) = R', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'C', 'E'), 'R');
});

test('binary-lifting LCA(F, E) = R', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'F', 'E'), 'R');
});

test('binary-lifting LCA(F, C) = C（祖先关系）', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'F', 'C'), 'C');
});

test('binary-lifting LCA(u, u) = u', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'D', 'D'), 'D');
  assert.equal(lca(bl, 'R', 'R'), 'R');
});

test('binary-lifting LCA(根, 叶) = 根', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'R', 'F'), 'R');
});

test('binary-lifting 任意两叶的 LCA 存在', () => {
  const bl = build(T);
  for (const u of T.nodes) {
    for (const v of T.nodes) {
      const a = lca(bl, u, v);
      assert.ok(a !== null, `LCA(${u},${v}) 不应为 null`);
      assert.ok(T.nodes.includes(a!));
    }
  }
});

test('binary-lifting 单节点树', () => {
  const t: TreeInput = { nodes: ['X'], parents: ['X'], root: 'X' };
  const bl = build(t);
  assert.equal(lca(bl, 'X', 'X'), 'X');
});

test('binary-lifting 链式树 LCA', () => {
  // 1-2-3-4-5（链）
  const t: TreeInput = {
    nodes: ['1', '2', '3', '4', '5'],
    parents: ['1', '1', '2', '3', '4'],
    root: '1',
  };
  const bl = build(t);
  assert.equal(lca(bl, '4', '5'), '4');
  assert.equal(lca(bl, '5', '2'), '2');
  assert.equal(lca(bl, '5', '1'), '1');
});

test('binary-lifting depth 正确', () => {
  const bl = build(T);
  const depthOf = (id: string) => bl.depth[bl.indexOf.get(id)!];
  assert.equal(depthOf('R'), 0);
  assert.equal(depthOf('A'), 1);
  assert.equal(depthOf('C'), 2);
  assert.equal(depthOf('F'), 3);
});

test('binary-lifting 钩子被调用', () => {
  const bl = build(T);
  let lifts = 0;
  let aligned = 0;
  let lcaFound = -1;
  lca(bl, 'F', 'E', {
    onLift: () => lifts++,
    onAligned: () => aligned++,
    onLca: (idx) => {
      lcaFound = idx;
    },
  });
  assert.ok(lifts > 0, '应发生上跳');
  assert.equal(aligned, 1, '对齐一次');
  assert.equal(bl.nodes[lcaFound], 'R');
});

test('binary-lifting 便捷入口 binaryLifting', () => {
  assert.equal(binaryLifting(T, 'C', 'E'), 'R');
});

test('binary-lifting 查询不存在的节点返回 null', () => {
  const bl = build(T);
  assert.equal(lca(bl, 'C', 'Z'), null);
});
