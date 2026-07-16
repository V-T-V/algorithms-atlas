import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cdt, type GraphInput } from '../../src/algorithms/graph/cdt/impl.ts';

const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

const _norm = (arr: string[]): string[] => [...arr].sort();

test('cdt 生成方点数 = 点双数', () => {
  const { squareOf } = cdt(G);
  assert.equal(squareOf.size, 3); // {0,1,2}, {2,3}, {3,4,5}
});

test('cdt 圆方树是一棵树（边数 = 节点数-1）', () => {
  const { treeNodes, treeEdges } = cdt(G);
  // 树节点 = 6 圆 + 3 方 = 9；边数应为 8
  assert.equal(treeNodes.length, 9);
  assert.equal(treeEdges.length, treeNodes.length - 1);
});

test('cdt 割点连接多个方点', () => {
  const { treeEdges } = cdt(G);
  // 割点 2 应连到 2 个方点；割点 3 同理
  const deg = new Map<string, number>();
  for (const [a, b] of treeEdges) {
    deg.set(a, (deg.get(a) ?? 0) + 1);
    deg.set(b, (deg.get(b) ?? 0) + 1);
  }
  assert.equal(deg.get('2'), 2);
  assert.equal(deg.get('3'), 2);
  // 非割点 0 只连 1 个方点
  assert.equal(deg.get('0'), 1);
});

test('cdt 每个方点的邻接都是圆点', () => {
  const { treeEdges, squareOf } = cdt(G);
  const squareSet = new Set(squareOf.keys());
  for (const [a, b] of treeEdges) {
    const aSq = squareSet.has(a);
    const bSq = squareSet.has(b);
    assert.ok(aSq !== bSq, '圆方树边必须一圆一方');
  }
});

test('cdt 单点：自成一方', () => {
  const { squareOf, treeEdges } = cdt({ nodes: ['X'], edges: [] });
  assert.equal(squareOf.size, 1);
  assert.equal(treeEdges.length, 1);
});

test('cdt 钩子被调用', () => {
  const squares: string[] = [];
  let doneEdges = -1;
  cdt(G, {
    onSquareNode: (sid) => squares.push(sid),
    onDone: (n) => {
      doneEdges = n;
    },
  });
  assert.equal(squares.length, 3);
  assert.ok(doneEdges >= 0);
});
