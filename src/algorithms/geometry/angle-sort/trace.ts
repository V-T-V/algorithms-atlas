// 极角排序 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { angleSort, type Point, type AngleSortHooks } from './impl.ts';

export interface AngleInput {
  points: Point[];
}

export const DEFAULT_INPUT: AngleInput = {
  points: [
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: -1, y: 1 },
    { x: 0, y: 0 },
  ],
};

const graphFrom = (pts: Point[], order: number[] | null, anchor?: Point) => ({
  nodes: [
    ...(anchor
      ? [
          {
            id: 'O',
            label: 'O',
            x: ((anchor.x + 4) % 9) / 9,
            y: 1 - ((anchor.y + 4) % 9) / 9,
            role: 'pivot' as BarRole,
          },
        ]
      : []),
    ...pts.map((p, i) => ({
      id: `p${i}`,
      label: String(i),
      x: ((p.x + 4) % 9) / 9,
      y: 1 - ((p.y + 4) % 9) / 9,
      role: (order ? 'final' : 'default') as BarRole,
    })),
  ],
  edges: order
    ? order.slice(0, -1).map((idx, k) => ({ from: `p${idx}`, to: `p${order[k + 1]!}` }))
    : [],
});

/** 录制演示帧序列。 */
export function buildTrace(input: AngleInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points } = input;

  rec
    .begin({ zh: `点集（${points.length} 个）`, en: `Point set (${points.length} pts)` })
    .setGraph(graphFrom(points, null).nodes, [])
    .commit();

  const hooks: AngleSortHooks = {
    onAnchor: (o) => {
      rec
        .begin({ zh: `选定极点 O(${o.x},${o.y})`, en: `Anchor O(${o.x},${o.y})` })
        .setGraph(graphFrom(points, null, o).nodes, [])
        .commit();
    },
    onSorted: (order) => {
      rec
        .begin({ zh: `按极角升序完成`, en: `Sorted by angle ascending` })
        .setGraph(graphFrom(points, order).nodes, graphFrom(points, order).edges)
        .commit();
    },
  };
  angleSort(points, undefined, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setMap([{ key: '结果', value: '已按极角排序', role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
