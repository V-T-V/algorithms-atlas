// =============================================================================
// 点在凸多边形内（二分法）· 录制帧序列
// 用 setGraph 展示凸多边形、极点 p0 与查询点 q，高亮当前二分扇形。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointInConvex, type Point, type PointInConvexHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 逆时针凸五边形
  polygon: [
    { x: 1, y: 1 },
    { x: 4, y: 0 },
    { x: 6, y: 3 },
    { x: 4, y: 6 },
    { x: 1, y: 5 },
  ] as Point[],
  query: { x: 3, y: 3 } as Point,
};

interface BuildTraceInput {
  polygon?: Point[];
  query?: Point;
}

const BX = 7;
const BY = 7;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const polygon = input.polygon ?? DEFAULT_INPUT.polygon;
  const query = input.query ?? DEFAULT_INPUT.query;
  const rec = new TraceRecorder();

  const polyNodes: GraphNode[] = polygon.map((p, i) => ({
    id: `v${i}`,
    label: i === 0 ? 'p0' : String(i),
    ...norm(p.x, p.y),
    role: (i === 0 ? 'pivot' : 'default') as BarRole,
  }));
  const polyEdges: GraphEdge[] = polygon.map((_, i) => ({
    from: `v${i}`,
    to: `v${(i + 1) % polygon.length}`,
    role: 'default' as BarRole,
  }));

  const render = (
    note: { zh: string; en: string },
    queryRole: BarRole,
    wedgeLo: number = -1,
    wedgeHi: number = -1,
  ): void => {
    const qNode: GraphNode = { id: 'q', label: '?', ...norm(query.x, query.y), role: queryRole };
    // 若指定扇形，高亮 p0→v_lo 与 p0→v_hi
    const extraEdges: GraphEdge[] = [];
    if (wedgeLo >= 0)
      extraEdges.push({ from: 'v0', to: `v${wedgeLo}`, role: 'compare' as BarRole });
    if (wedgeHi >= 0) extraEdges.push({ from: 'v0', to: `v${wedgeHi}`, role: 'swap' as BarRole });
    rec
      .begin(note)
      .setGraph([...polyNodes, qNode], [...polyEdges, ...extraEdges])
      .setAux([
        { label: '查询点', value: `(${query.x},${query.y})`, role: 'pivot' as BarRole },
        { label: '极点', value: 'p0', role: 'compare' as BarRole },
      ])
      .commit();
  };

  render(
    {
      zh: `查询点 (${query.x},${query.y})，以 p0 为极点`,
      en: `Query (${query.x},${query.y}), polar origin p0`,
    },
    'pivot',
  );

  const hooks: PointInConvexHooks = {
    onRangeCheck: (_q, inRange) => {
      render(
        {
          zh: `方位检查：q ${inRange ? '在' : '不在'} [p0→v1, p0→v_{n−1}] 范围内`,
          en: `Range check: q ${inRange ? 'inside' : 'outside'} [p0→v1, p0→v_{n−1}]`,
        },
        inRange ? 'pivot' : 'warn',
      );
    },
    onBinarySearch: (lo, hi, mid) => {
      render(
        {
          zh: `二分：lo=${lo}, hi=${hi}, mid=${mid}`,
          en: `Binary search: lo=${lo}, hi=${hi}, mid=${mid}`,
        },
        'compare',
        mid,
      );
    },
    onFinalTest: (k, cv, inside) => {
      render(
        {
          zh: `扇形 k=${k}：cross=${cv.toFixed(2)} → ${inside ? '内部' : '外部'}`,
          en: `Wedge k=${k}: cross=${cv.toFixed(2)} → ${inside ? 'inside' : 'outside'}`,
        },
        inside ? 'final' : 'warn',
        k,
        k + 1,
      );
    },
  };

  const result = pointInConvex(query, polygon, hooks);

  render(
    {
      zh: `完成：点在${result === 'in' ? '内部' : result === 'on' ? '边界' : '外部'}`,
      en: `Done: point is ${result === 'in' ? 'inside' : result === 'on' ? 'on edge' : 'outside'}`,
    },
    result === 'out' ? 'warn' : 'final',
  );

  return rec.build();
}
