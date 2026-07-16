import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kruskal, type GraphInput } from '../../src/algorithms/graph/kruskal/impl.ts';

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

test('kruskal 正确 MST 总权重', () => {
  // 手算：EF(1)+BC(2)+AB(4)+CD(5)+DE(7) = 19
  const r = kruskal(G);
  assert.equal(r.totalWeight, 19);
  assert.equal(r.edges.length, 5); // V-1 = 6-1
  assert.equal(r.connected, true);
});

test('kruskal MST 边集正确', () => {
  const r = kruskal(G);
  const set = new Set(r.edges.map((e) => edgeKey(e.from, e.to)));
  assert.ok(set.has('E-F'));
  assert.ok(set.has('B-C'));
  assert.ok(set.has('A-B'));
  assert.ok(set.has('C-D'));
  assert.ok(set.has('D-E'));
  assert.ok(!set.has('A-C')); // 成环被拒
  assert.ok(!set.has('B-D')); // 成环被拒
});

test('kruskal 单节点图', () => {
  const r = kruskal({ nodes: ['X'], edges: [] });
  assert.equal(r.totalWeight, 0);
  assert.equal(r.edges.length, 0);
  assert.equal(r.connected, true); // 单节点视为连通
});

test('kruskal 不连通图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'C', to: 'D', weight: 2 },
    ],
  };
  const r = kruskal(g);
  assert.equal(r.edges.length, 2);
  assert.equal(r.totalWeight, 3);
  assert.equal(r.connected, false); // V-1=3，仅 2 条边 → 不连通
});

test('kruskal 同权边字典序确定', () => {
  // 两条同权边，选字典序小的（A-B 先于 A-C）
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'C', weight: 1 },
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
    ],
  };
  const r = kruskal(g);
  assert.equal(r.totalWeight, 2);
  // 第三条必成环被拒
  assert.equal(r.edges.length, 2);
  const first = r.edges[0];
  assert.ok(first && edgeKey(first.from, first.to) === 'A-B');
});

test('kruskal 钩子被调用', () => {
  const examined: Array<{ e: string; accepted: boolean }> = [];
  const treeEdges: string[] = [];
  let doneWeight = -1;
  kruskal(G, {
    onExamine: (f, t, _w, acc) => examined.push({ e: edgeKey(f, t), accepted: acc }),
    onTreeEdge: (f, t) => treeEdges.push(edgeKey(f, t)),
    onDone: (tw) => {
      doneWeight = tw;
    },
  });
  assert.equal(examined.length, 7); // 第 6 条选完即停（V-1=5），共考察 7 条
  assert.equal(treeEdges.length, 5);
  assert.equal(doneWeight, 19);
  // 第二条考察的 AC 必被拒（A,B,C 已连通）
  const acExam = examined.find((x) => x.e === 'A-C');
  assert.ok(acExam && acExam.accepted === false);
});
