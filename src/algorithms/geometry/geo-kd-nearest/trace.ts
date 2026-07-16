// =============================================================================
// KD-Tree 最近邻 · 录制帧序列
// =============================================================================

import type { Frame, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildKDTree, kdNearest, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  points: [
    { x: 1, y: 1 },
    { x: 2, y: 5 },
    { x: 5, y: 4 },
    { x: 7, y: 2 },
    { x: 8, y: 7 },
    { x: 3, y: 8 },
  ] as Point[],
  target: { x: 4, y: 3 } as Point,
};

function normalizer(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const span = Math.max(spanX, spanY);
  const pad = 0.1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return (p) => ({
    x: 0.5 + (0.5 - pad) * ((p.x - cx) / span) * 2,
    y: 0.5 + (0.5 - pad) * ((cy - p.y) / span) * 2,
  });
}

export function buildTrace(input: { points: Point[]; target: Point } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, target } = input;
  const norm = normalizer([...points, target]);

  const baseNodes: GraphNode[] = [
    ...points.map((p, i) => ({
      id: 'p' + i,
      label: String(i),
      x: norm(p).x,
      y: norm(p).y,
      role: 'default' as const,
    })),
    { id: 't', label: 'T', x: norm(target).x, y: norm(target).y, role: 'pivot' },
  ];

  rec
    .begin({
      zh: `KD-Tree 最近邻：${points.length} 点，查询 T(${target.x},${target.y})`,
      en: `KD-Tree NN: ${points.length} points, query T(${target.x},${target.y})`,
    })
    .setGraph(baseNodes, [])
    .setAux([
      { label: '目标 T', value: `(${target.x},${target.y})`, role: 'pivot' },
      { label: '点数', value: String(points.length), role: 'frontier' },
    ])
    .commit();

  const tree = buildKDTree(points);
  const visited = new Set<Point>();
  let best: Point | null = null;

  const result = tree
    ? kdNearest(tree, target, {
        onVisit: (node, curBest) => {
          visited.add(node.point);
          if (curBest) best = curBest;
          const nodes: GraphNode[] = points.map((p, i) => ({
            id: 'p' + i,
            label: String(i),
            x: norm(p).x,
            y: norm(p).y,
            role:
              best && p.x === best.x && p.y === best.y
                ? 'final'
                : visited.has(p)
                  ? 'compare'
                  : 'default',
          }));
          rec
            .begin({
              zh: `访问 (${node.point.x},${node.point.y})，当前最近 = ${best ? `(${best.x},${best.y})` : '无'}`,
              en: `Visit (${node.point.x},${node.point.y}), best = ${best ? `(${best.x},${best.y})` : 'none'}`,
            })
            .setGraph(
              [
                ...nodes,
                { id: 't', label: 'T', x: norm(target).x, y: norm(target).y, role: 'pivot' },
              ],
              [],
            )
            .setAux([
              { label: '当前最近', value: best ? `(${best.x},${best.y})` : '-', role: 'final' },
              { label: '已访问', value: String(visited.size), role: 'frontier' },
            ])
            .commit();
        },
      })
    : null;

  rec
    .begin({
      zh: `完成：最近邻 = ${result ? `(${result.x},${result.y})` : '无'}`,
      en: `Done: nearest = ${result ? `(${result.x},${result.y})` : 'none'}`,
    })
    .setAux([
      { label: '最近邻', value: result ? `(${result.x},${result.y})` : '-', role: 'final' },
      { label: '总访问', value: String(visited.size), role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
