// 拉格朗日插值 · 录制帧序列
// 用 setGraph 展示数据点 + 插值曲线，setAux 展示各基多项式。

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lagrangeInterpolate, type DataPoint, type LagrangeHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  points: [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 2 },
    { x: 3, y: 4 },
  ] as DataPoint[],
  query: 1.5,
};

const XMAX = 4;
const YMAX = 6;

export function buildTrace(input: { points: DataPoint[]; query: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, query } = input;

  const render = (note: { zh: string; en: string }, bases: number[], queryVal?: number) => {
    const nodes: GraphNode[] = points.map((p, i) => ({
      id: `p${i}`,
      label: `(${p.x},${p.y})`,
      x: p.x / XMAX,
      y: 1 - p.y / YMAX, // 翻转 y（SVG y 向下）
      role: 'pivot' as BarRole,
    }));
    if (queryVal !== undefined) {
      nodes.push({
        id: 'q',
        label: queryVal.toFixed(2),
        x: query / XMAX,
        y: 1 - queryVal / YMAX,
        role: 'final' as BarRole,
      });
    }
    // 插值曲线采样点
    const curveNodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    let prev: string | null = null;
    for (let sx = 0; sx <= XMAX * 10; sx++) {
      const xx = sx / 10;
      const yy = lagrangeInterpolate(points, xx);
      const id = `c${sx}`;
      curveNodes.push({ id, x: xx / XMAX, y: 1 - Math.max(0, Math.min(YMAX, yy)) / YMAX });
      if (prev) edges.push({ from: prev, to: id });
      prev = id;
    }
    rec
      .begin(note)
      .setGraph([...curveNodes, ...nodes], edges)
      .setAux(
        bases.map((b, i) => ({
          label: `L${i}`,
          value: b.toFixed(4),
          role: 'compare' as BarRole,
        })),
      )
      .commit();
  };

  const bases: number[] = new Array(points.length).fill(0);
  render(
    { zh: `查询 x=${query}，计算各基多项式`, en: `Query x=${query}, compute basis polys` },
    bases,
  );

  const hooks: LagrangeHooks = {
    onBasis: (i, bv) => {
      bases[i] = bv;
      render(
        {
          zh: `基 L${i}(${query}) = ${bv.toFixed(4)}`,
          en: `Basis L${i}(${query}) = ${bv.toFixed(4)}`,
        },
        bases,
      );
    },
  };

  const result = lagrangeInterpolate(points, query, hooks);
  render(
    { zh: `P(${query}) = ${result.toFixed(4)}`, en: `P(${query}) = ${result.toFixed(4)}` },
    bases,
    result,
  );

  return rec.build();
}
