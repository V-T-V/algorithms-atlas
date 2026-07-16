import { test } from 'node:test';
import assert from 'node:assert/strict';
import { johnson, type GraphInput } from '../../src/algorithms/graph/johnson/impl.ts';

/** Floyd-Warshall 参考实现，用于交叉校验全源最短路。 */
function floydWarshall(input: GraphInput): Map<string, Map<string, number>> {
  const { nodes, edges, directed = false } = input;
  const d = new Map<string, Map<string, number>>();
  for (const a of nodes) {
    d.set(a, new Map(nodes.map((b) => [b, a === b ? 0 : Infinity])));
  }
  const apply = (u: string, v: string, w: number): void => {
    const row = d.get(u)!;
    row.set(v, Math.min(row.get(v) ?? Infinity, w));
  };
  for (const e of edges) {
    apply(e.from, e.to, e.weight);
    if (!directed) apply(e.to, e.from, e.weight);
  }
  for (const k of nodes) {
    for (const i of nodes) {
      for (const j of nodes) {
        const dk = d.get(k)!.get(j)!;
        const di = d.get(i)!.get(k)!;
        if (di === Infinity || dk === Infinity) continue;
        const via = di + dk;
        if (via < (d.get(i)!.get(j) ?? Infinity)) d.get(i)!.set(j, via);
      }
    }
  }
  return d;
}

const INF = Infinity;
const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  directed: true,
  edges: [
    { from: '0', to: '1', weight: 4 },
    { from: '0', to: '2', weight: 1 },
    { from: '2', to: '1', weight: 2 },
    { from: '1', to: '3', weight: 1 },
    { from: '2', to: '3', weight: 5 },
    { from: '3', to: '4', weight: 3 },
    { from: '4', to: '2', weight: -1 },
  ],
};

const approx = (x: number): number => (Number.isFinite(x) ? x : INF);

test('johnson 与 Floyd-Warshall 结果一致（含负权边）', () => {
  const r = johnson(G);
  assert.equal(r.hasNegativeCycle, false);
  const ref = floydWarshall(G);
  for (const u of G.nodes) {
    for (const v of G.nodes) {
      const a = approx(r.dist.get(u)!.get(v)!);
      const b = approx(ref.get(u)!.get(v)!);
      assert.equal(a, b, `dist(${u}->${v}): Johnson=${a}, Floyd=${b}`);
    }
  }
});

test('johnson 特定距离断言', () => {
  const r = johnson(G);
  // 0→1 经 0→2→1 = 3
  assert.equal(r.dist.get('0')!.get('1'), 3);
  // 0→4 经 0→2→1→3→4 = 1+2+1+3 = 7
  assert.equal(r.dist.get('0')!.get('4'), 7);
  // 4→3 经 4→2→1→3 = -1+2+1 = 2
  assert.equal(r.dist.get('4')!.get('3'), 2);
  // 3→2 经 3→4→2 = 3-1 = 2
  assert.equal(r.dist.get('3')!.get('2'), 2);
});

test('johnson 检测负权环', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    directed: true,
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'A', weight: -3 }, // 总权 -1，负环
    ],
  };
  const r = johnson(g);
  assert.equal(r.hasNegativeCycle, true);
});

test('johnson 不可达为 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    directed: true,
    edges: [],
  };
  const r = johnson(g);
  assert.equal(r.dist.get('A')!.get('B'), Infinity);
  assert.equal(r.dist.get('A')!.get('A'), 0);
});

test('johnson 无向图重赋权非负后正确', () => {
  const g: GraphInput = {
    nodes: ['S', 'A', 'B'],
    directed: false,
    edges: [
      { from: 'S', to: 'A', weight: 2 },
      { from: 'A', to: 'B', weight: 3 },
      { from: 'S', to: 'B', weight: 6 },
    ],
  };
  const r = johnson(g);
  assert.equal(r.hasNegativeCycle, false);
  const ref = floydWarshall(g);
  for (const u of g.nodes) {
    for (const v of g.nodes) {
      assert.equal(approx(r.dist.get(u)!.get(v)!), approx(ref.get(u)!.get(v)!));
    }
  }
});

test('johnson 单节点', () => {
  const r = johnson({ nodes: ['X'], directed: true, edges: [] });
  assert.equal(r.dist.get('X')!.get('X'), 0);
  assert.equal(r.hasNegativeCycle, false);
});

test('johnson 钩子被调用', () => {
  let bellmanRounds = 0;
  let reweighted = false;
  let dijkstraSources = 0;
  let doneNeg: boolean | null = null;
  johnson(G, {
    onBellmanRound: () => bellmanRounds++,
    onReweighted: () => (reweighted = true),
    onDijkstraSource: () => dijkstraSources++,
    onDone: (neg) => (doneNeg = neg),
  });
  assert.ok(bellmanRounds >= 1, 'Bellman-Ford 至少跑一轮');
  assert.equal(reweighted, true);
  assert.equal(dijkstraSources, G.nodes.length);
  assert.equal(doneNeg, false);
});
