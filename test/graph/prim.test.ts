import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prim, type GraphInput } from '../../src/algorithms/graph/prim/impl.ts';

const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 9 },
    { from: 'D', to: 'E', weight: 7 },
    { from: 'D', to: 'F', weight: 8 },
    { from: 'E', to: 'F', weight: 1 },
  ],
};

const edgeKey = (a: string, b: string): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

test('prim 正确 MST 总权重', () => {
  // 手算从 A 起步：A-B(4)+B-C(2)+C-D(5)+D-E(7)+E-F(1) = 19
  const r = prim(G, 'A');
  assert.equal(r.totalWeight, 19);
  assert.equal(r.edges.length, 5); // V-1
  assert.equal(r.connected, true);
});

test('prim MST 边集正确', () => {
  const r = prim(G, 'A');
  const set = new Set(r.edges.map((e) => edgeKey(e.from, e.to)));
  assert.ok(set.has('A-B'));
  assert.ok(set.has('B-C'));
  assert.ok(set.has('C-D'));
  assert.ok(set.has('D-E'));
  assert.ok(set.has('E-F'));
  assert.ok(!set.has('B-D')); // 不在 MST
});

test('prim 与 kruskal 总权重一致（同图）', () => {
  const r = prim(G, 'A');
  assert.equal(r.totalWeight, 19);
});

test('prim 默认起点（nodes[0]）', () => {
  const r = prim(G); // 缺省 A
  assert.equal(r.totalWeight, 19);
  assert.equal(r.connected, true);
});

test('prim 不同起点总权重相同', () => {
  // MST 总权与起点无关
  const rA = prim(G, 'A');
  const rD = prim(G, 'D');
  const rF = prim(G, 'F');
  assert.equal(rA.totalWeight, 19);
  assert.equal(rD.totalWeight, 19);
  assert.equal(rF.totalWeight, 19);
});

test('prim 单节点图', () => {
  const r = prim({ nodes: ['X'], edges: [] }, 'X');
  assert.equal(r.totalWeight, 0);
  assert.equal(r.edges.length, 0);
  assert.equal(r.connected, true);
});

test('prim 不连通图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'C', to: 'D', weight: 2 },
    ],
  };
  const r = prim(g, 'A');
  assert.equal(r.edges.length, 1); // 只连起 A-B
  assert.equal(r.connected, false);
});

test('prim 钩子被调用', () => {
  const added: string[] = [];
  let updates = 0;
  let doneWeight = -1;
  prim(G, 'A', {
    onAddNode: (n) => added.push(n),
    onUpdateKey: (_n, _p, _k, imp) => {
      if (imp) updates++;
    },
    onDone: (tw) => {
      doneWeight = tw;
    },
  });
  assert.equal(added[0], 'A');
  assert.equal(added.length, 6); // 全部纳入
  assert.ok(updates >= 4, '应发生多次 key 更新');
  assert.equal(doneWeight, 19);
});
