// 点在多边形内 · 录制帧序列
// 用 setGraph 展示多边形顶点+边与查询点，射线交点高亮。

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointInPolygon, type Point, type PointInPolyHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  polygon: [
    { x: 1, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 4 },
    { x: 3, y: 6 },
    { x: 0, y: 4 },
  ] as Point[],
  query: { x: 3, y: 3 } as Point,
};

const BX = 7; // 归一化用的边界框尺寸
const BY = 7;

export function buildTrace(input: { polygon: Point[]; query: Point } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { polygon, query } = input;
  let crossingCount = 0;

  const render = (note: { zh: string; en: string }, checkedEdge: number, crossings: boolean[]) => {
    const nodes: GraphNode[] = polygon.map((v, i) => ({
      id: `v${i}`,
      label: String(i),
      x: v.x / BX,
      y: v.y / BY,
      role: 'default' as BarRole,
    }));
    nodes.push({
      id: 'q',
      label: '?',
      x: query.x / BX,
      y: query.y / BY,
      role: 'pivot' as BarRole,
    });
    const edges: GraphEdge[] = polygon.map((_, i) => {
      const j = (i + 1) % polygon.length;
      const role: BarRole =
        i === checkedEdge
          ? crossings[i]
            ? 'compare'
            : 'default'
          : crossings[i]
            ? 'final'
            : 'default';
      return { from: `v${i}`, to: `v${j}`, role };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  const crossings: boolean[] = new Array(polygon.length).fill(false);
  render(
    {
      zh: `查询点 (${query.x},${query.y})，射线向右`,
      en: `Query (${query.x},${query.y}), ray → right`,
    },
    -1,
    crossings,
  );

  const hooks: PointInPolyHooks = {
    onCheckEdge: (i, crossing) => {
      crossings[i] = crossing;
      if (crossing) crossingCount++;
      render(
        {
          zh: `检查边 ${i}→${(i + 1) % polygon.length}：${crossing ? '相交（+' + crossingCount + '）' : '不相交'}`,
          en: `Edge ${i}→${(i + 1) % polygon.length}: ${crossing ? 'crosses (count=' + crossingCount + ')' : 'no cross'}`,
        },
        i,
        crossings,
      );
    },
  };

  const inside = pointInPolygon(query, polygon, hooks);

  // 终态
  const nodes: GraphNode[] = polygon.map((v, i) => ({
    id: `v${i}`,
    label: String(i),
    x: v.x / BX,
    y: v.y / BY,
    role: 'default' as BarRole,
  }));
  nodes.push({
    id: 'q',
    label: inside ? '内' : '外',
    x: query.x / BX,
    y: query.y / BY,
    role: (inside ? 'final' : 'warn') as BarRole,
  });
  const edges: GraphEdge[] = polygon.map((_, i) => ({
    from: `v${i}`,
    to: `v${(i + 1) % polygon.length}`,
    role: (crossings[i] ? 'final' : 'default') as BarRole,
  }));
  rec
    .begin({
      zh: `交点 ${crossingCount} 个 → ${inside ? '在内部（奇数）' : '在外部（偶数）'}`,
      en: `${crossingCount} crossings → ${inside ? 'inside (odd)' : 'outside (even)'}`,
    })
    .setGraph(nodes, edges)
    .commit();

  return rec.build();
}
