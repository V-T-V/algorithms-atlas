import { test } from 'node:test';
import assert from 'node:assert/strict';
import { voronoi } from '../../src/algorithms/geometry/voronoi/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/voronoi/trace.ts';

test('voronoi 至少生成边', () => {
  const { edges } = voronoi([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 4 },
    { x: 4, y: 4 },
  ]);
  assert.ok(edges.length >= 1);
});

test('voronoi 三点 → 1 条边', () => {
  const { edges } = voronoi([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 3 },
  ]);
  assert.ok(edges.length >= 1);
});

test('voronoi 钩子触发', () => {
  let n = 0;
  voronoi(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 3 },
    ],
    { onDualEdge: () => n++ },
  );
  assert.ok(n >= 1);
});

test('buildTrace 含边', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
