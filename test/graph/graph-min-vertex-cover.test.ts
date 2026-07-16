import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minVertexCoverApprox } from '../../src/algorithms/graph/graph-min-vertex-cover/impl.ts';

const isCover = (cover: string[], edges: ReadonlyArray<{ from: string; to: string }>): boolean => {
  const set = new Set(cover);
  for (const e of edges) {
    if (!set.has(e.from) && !set.has(e.to)) return false;
  }
  return true;
};

test('vertex-cover 路径', () => {
  const G = {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
    ],
  };
  const c = minVertexCoverApprox(G);
  assert.ok(isCover(c, G.edges));
  // 路径 P6 的最小覆盖 = 3；2-近似最多 6
  assert.ok(c.length >= 3 && c.length <= 6);
});

test('vertex-cover 三角形', () => {
  const G = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  };
  const c = minVertexCoverApprox(G);
  assert.ok(isCover(c, G.edges));
});

test('vertex-cover 单边', () => {
  const c = minVertexCoverApprox({ nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }] });
  assert.equal(c.length, 2);
});

test('vertex-cover 无边', () => {
  const c = minVertexCoverApprox({ nodes: ['A', 'B'], edges: [] });
  assert.equal(c.length, 0);
});
