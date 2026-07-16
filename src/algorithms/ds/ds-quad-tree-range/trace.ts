// =============================================================================
// 四叉树 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QuadTree, type QPoint, type Rect, type QuadHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  region: Rect;
  points: QPoint[];
  query: Rect;
} = {
  region: { x0: 0, y0: 0, x1: 63, y1: 63 },
  points: [
    { x: 5, y: 5, value: 1 },
    { x: 50, y: 50, value: 2 },
    { x: 30, y: 30, value: 3 },
    { x: 10, y: 40, value: 4 },
    { x: 45, y: 10, value: 5 },
    { x: 60, y: 5, value: 6 },
    { x: 5, y: 60, value: 7 },
  ],
  query: { x0: 0, y0: 0, x1: 31, y1: 31 },
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { region, points, query } = input;

  rec
    .begin({
      zh: `四叉树：区域 [${region.x0},${region.y0}]-[${region.x1},${region.y1}]，插入 ${points.length} 点`,
      en: `Quad tree: region [${region.x0},${region.y0}]-[${region.x1},${region.y1}], insert ${points.length} pts`,
    })
    .commit();

  const hooks: QuadHooks = {
    onSplit: (r, depth) => {
      rec
        .begin({
          zh: `分裂 [${r.x0},${r.y0}]-[${r.x1},${r.y1}]（深度 ${depth}）`,
          en: `Split [${r.x0},${r.y0}]-[${r.x1},${r.y1}] (depth ${depth})`,
        })
        .setAux([{ label: '分裂', value: String(depth), role: 'frontier' }])
        .commit();
    },
    onInsert: (p) => {
      rec
        .begin({
          zh: `插入 (${p.x},${p.y}) = ${p.value}`,
          en: `Insert (${p.x},${p.y}) = ${p.value}`,
        })
        .setAux([{ label: '插入', value: `(${p.x},${p.y})`, role: 'compare' }])
        .commit();
    },
    onCollect: (p) => {
      rec
        .begin({ zh: `命中 (${p.x},${p.y})`, en: `Hit (${p.x},${p.y})` })
        .setAux([{ label: '命中', value: String(p.value), role: 'final' }])
        .commit();
    },
  };

  const qt = new QuadTree(region, hooks);
  for (const p of points) qt.insert(p);
  const result = qt.rangeQuery(query);
  rec
    .begin({
      zh: `查询 [${query.x0},${query.y0}]-[${query.x1},${query.y1}] 命中 ${result.length} 点`,
      en: `Query [${query.x0},${query.y0}]-[${query.x1},${query.y1}] hit ${result.length} pts`,
    })
    .setAux([{ label: '命中数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
