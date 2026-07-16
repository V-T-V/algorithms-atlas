// =============================================================================
// 在线凸包 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { onlineConvexHull, inConvexHull, type Point } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
  { x: 2, y: 2 },
  { x: 5, y: 2 },
  { x: 2, y: 5 },
];

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

export function buildTrace(points: readonly Point[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const norm = normalizer(points);
  const seen: Point[] = [];
  let hull: Point[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = seen.map((p, i) => ({
      id: 'p' + i,
      label: String(i),
      x: norm(p).x,
      y: norm(p).y,
      role: hull.some((h) => h.x === p.x && h.y === p.y) ? 'final' : 'default',
    }));
    const hidx: number[] = [];
    for (let i = 0; i < seen.length; i++) {
      const p = seen[i]!;
      if (hull.some((h) => h.x === p.x && h.y === p.y)) hidx.push(i);
    }
    const edges: GraphEdge[] = [];
    for (let i = 0; i < hidx.length; i++) {
      edges.push({ from: 'p' + hidx[i]!, to: 'p' + hidx[(i + 1) % hidx.length]!, role: 'compare' });
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '已插入', value: String(seen.length), role: 'frontier' },
        { label: '凸包大小', value: String(hull.length), role: 'final' },
      ])
      .commit();
  };

  render({
    zh: `开始：依次插入 ${points.length} 点`,
    en: `Start: insert ${points.length} points one by one`,
  });

  hull = onlineConvexHull(points, {
    onInsert: (p, inside, hullSize) => {
      seen.push(p);
      if (!inside) {
        // 重建 hull（与 impl 内部一致）
        hull = hullSize === 0 ? [] : rebuildHull(seen);
      }
      render({
        zh: `插入 (${p.x},${p.y})：${inside ? '在内部，凸包不变' : '在外部，凸包更新为 ' + hull.length + ' 点'}`,
        en: `Insert (${p.x},${p.y}): ${inside ? 'inside, hull unchanged' : 'outside, hull now ' + hull.length + ' pts'}`,
      });
    },
  });

  void inConvexHull;
  rec
    .begin({ zh: `完成：凸包 ${hull.length} 点`, en: `Done: hull has ${hull.length} points` })
    .setAux([{ label: '最终凸包大小', value: String(hull.length), role: 'final' }])
    .commit();

  return rec.build();
}

/** 与 impl 一致的本地重建（供 trace 同步状态）。 */
function rebuildHull(seen: Point[]): Point[] {
  if (seen.length < 3) return seen.slice();
  let left = 0;
  for (let i = 1; i < seen.length; i++) if (seen[i]!.x < seen[left]!.x) left = i;
  const out: Point[] = [];
  let p = left;
  do {
    out.push(seen[p]!);
    let q = (p + 1) % seen.length;
    for (let i = 0; i < seen.length; i++) {
      const c =
        (seen[i]!.x - seen[p]!.x) * (seen[q]!.y - seen[p]!.y) -
        (seen[i]!.y - seen[p]!.y) * (seen[q]!.x - seen[p]!.x);
      if (c < -1e-9) q = i;
    }
    p = q;
  } while (p !== left && out.length <= seen.length);
  return out;
}
