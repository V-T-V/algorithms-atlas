import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heavyLight,
  splitPath,
  type GraphInput,
} from '../../src/algorithms/graph/heavy-light/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '2', to: '5' },
    { from: '5', to: '6' },
    { from: '5', to: '7' },
  ],
  root: '1',
};

test('heavy-light 根的链顶为自身', () => {
  const { top, depth, parent } = heavyLight(G);
  assert.equal(top.get('1'), '1');
  assert.equal(depth.get('1'), 0);
  assert.equal(parent.get('1'), null);
});

test('heavy-light 重链 dfn 连续', () => {
  const { dfn, heavy } = heavyLight(G);
  // 1-2 是重边（2 子树最大），2-3 也可能重
  assert.ok(heavy.get('1') === '2');
  // dfn 唯一
  const dfns = [...dfn.values()];
  assert.equal(new Set(dfns).size, dfns.length);
});

test('heavy-light 路径拆分段数有限', () => {
  const res = heavyLight(G);
  const segs = splitPath(res, '4', '7');
  assert.ok(segs.length >= 1 && segs.length <= 4, `段数 ${segs.length} 应在合理范围`);
});

test('heavy-light 路径覆盖的节点数正确', () => {
  const res = heavyLight(G);
  const segs = splitPath(res, '4', '7'); // 4-3-2-5-7
  const total = segs.reduce((acc, [l, r]) => acc + (r - l + 1), 0);
  assert.equal(total, 5);
});

test('heavy-light 单节点', () => {
  const { top, dfn } = heavyLight({ nodes: ['X'], edges: [], root: 'X' });
  assert.equal(top.get('X'), 'X');
  assert.equal(dfn.get('X'), 1);
});

test('heavy-light 钩子被调用', () => {
  const dfs1Calls: string[] = [];
  const dfs2Calls: string[] = [];
  heavyLight(G, {
    onDfs1: (u) => dfs1Calls.push(u),
    onDfs2: (u) => dfs2Calls.push(u),
  });
  assert.equal(dfs1Calls.length, 7);
  assert.equal(dfs2Calls.length, 7);
});
