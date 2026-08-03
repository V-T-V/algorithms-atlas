import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  topologicalSort,
  topologicalSortDfs,
  type GraphInput,
} from '../../src/algorithms/graph/topological-sort/impl.ts';

test('topological-sort 基本行为', () => {
  const graph: GraphInput = {
    nodes: ['a', 'b', 'c', 'd'],
    edges: [
      { from: 'a', to: 'c' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'd' },
    ],
  };
  const result = topologicalSort(graph);

  assert.equal(result.isDag, true);
  assert.deepEqual(result.order, ['a', 'b', 'c', 'd']);
  assert.deepEqual(topologicalSort({ nodes: [], edges: [] }).order, []);
  assert.deepEqual(topologicalSort({ nodes: ['x'], edges: [] }).order, ['x']);
});

test('topological-sort 检测环', () => {
  const result = topologicalSort({
    nodes: ['a', 'b', 'c'],
    edges: [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'a' },
    ],
  });

  assert.equal(result.isDag, false);
  assert.equal(result.order.length, 0);
});

test('topological-sort dfs 版本返回合法拓扑序', () => {
  assert.deepEqual(
    topologicalSortDfs({
      nodes: ['a', 'b', 'c'],
      edges: [
        { from: 'a', to: 'c' },
        { from: 'b', to: 'c' },
      ],
    }).order,
    ['b', 'a', 'c'],
  );
});

test('topological-sort 自环视为环（非 DAG）', () => {
  const r = topologicalSort({ nodes: ['A'], edges: [{ from: 'A', to: 'A' }] });
  assert.equal(r.isDag, false);
});

test('topological-sort 属性：随机 DAG 的拓扑序对所有边合法', () => {
  // 只在 i<j 间加边 → 必为 DAG；校验输出序对每条边 u→v 都有 u 在 v 前
  const validTopo = (order: string[], edges: Array<{ from: string; to: string }>): boolean => {
    const pos = new Map(order.map((n, i) => [n, i]));
    for (const e of edges) {
      if (pos.has(e.from) && pos.has(e.to) && pos.get(e.from)! >= pos.get(e.to)!) return false;
    }
    return true;
  };
  // 固定一组确定性 DAG
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4'],
    edges: [
      { from: '0', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '4' },
      { from: '0', to: '4' },
    ],
  };
  const r = topologicalSort(g);
  assert.equal(r.isDag, true);
  assert.equal(r.order.length, 5);
  assert.equal(validTopo(r.order, g.edges), true);
  // DFS 版本同样合法
  assert.equal(validTopo(topologicalSortDfs(g).order, g.edges), true);
});
