import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfs } from '../../src/algorithms/graph/bfs/impl.ts';
import { dfs } from '../../src/algorithms/graph/dfs/impl.ts';
import { dijkstra } from '../../src/algorithms/graph/dijkstra/impl.ts';

/** 简单确定性 LCG，保证测试可复现。 */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 4294967296;
  };
}

interface SimpleGraph {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight?: number }>;
}

/** 用 LCG 生成一个连通性随机的无向图。 */
function genGraph(rng: () => number, n: number): SimpleGraph {
  const nodes = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  const edges: SimpleGraph['edges'] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (rng() < 0.4) edges.push({ from: nodes[i]!, to: nodes[j]! });
    }
  }
  return { nodes, edges };
}

/** 参考可达集（无向 BFS）。 */
function reachableSet(g: SimpleGraph, start: string): Set<string> {
  const adj = new Map<string, string[]>();
  for (const nd of g.nodes) adj.set(nd, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  const seen = new Set<string>([start]);
  const q = [start];
  while (q.length) {
    const u = q.shift()!;
    for (const v of adj.get(u) ?? []) if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
  return seen;
}

test('BFS/DFS：访问集合等于无向可达集（多组随机图）', () => {
  const rng = lcg(20260803);
  for (let t = 0; t < 50; t++) {
    const n = 3 + Math.floor(rng() * 6);
    const g = genGraph(rng, n);
    const start = g.nodes[Math.floor(rng() * n)]!;
    const ref = reachableSet(g, start);
    const bfsSet = new Set(bfs(g, start));
    const dfsSet = new Set(dfs(g, start));
    assert.equal(bfsSet.size, ref.size, `BFS 规模不符: g=${JSON.stringify(g)} start=${start}`);
    assert.ok([...bfsSet].every((x) => ref.has(x)), 'BFS 节点应全部可达');
    assert.equal(dfsSet.size, ref.size, `DFS 规模不符`);
    assert.ok([...dfsSet].every((x) => ref.has(x)), 'DFS 节点应全部可达');
  }
});

/** Bellman-Ford 作为 Dijkstra 的对照（无负权）。 */
function bellmanFord(g: SimpleGraph, src: string): Map<string, number> {
  const d = new Map<string, number>(g.nodes.map((n) => [n, Infinity]));
  d.set(src, 0);
  const wedges = g.edges.map((e) => ({ ...e, weight: e.weight ?? 1 }));
  for (let k = 0; k < g.nodes.length - 1; k++) {
    for (const e of wedges) {
      if (d.get(e.from)! + (e.weight ?? 1) < d.get(e.to)!) d.set(e.to, d.get(e.from)! + (e.weight ?? 1));
      if (d.get(e.to)! + (e.weight ?? 1) < d.get(e.from)!) d.set(e.from, d.get(e.to)! + (e.weight ?? 1));
    }
  }
  return d;
}

test('Dijkstra：与 Bellman-Ford 对照一致（随机加权图）', () => {
  const rng = lcg(42);
  for (let t = 0; t < 40; t++) {
    const n = 3 + Math.floor(rng() * 6);
    const g = genGraph(rng, n);
    const wg: SimpleGraph = { nodes: g.nodes, edges: g.edges.map((e) => ({ ...e, weight: 1 + Math.floor(rng() * 9) })) };
    const src = wg.nodes[Math.floor(rng() * n)]!;
    const dij = dijkstra(wg, src);
    const bf = bellmanFord(wg, src);
    for (const nd of wg.nodes) {
      assert.equal(dij.dist.get(nd), bf.get(nd), `dist(${nd}) 不符: src=${src} g=${JSON.stringify(wg)}`);
    }
  }
});
