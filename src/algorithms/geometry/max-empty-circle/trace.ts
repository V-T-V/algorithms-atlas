// =============================================================================
// 最大空圆 · 录制帧序列
// 用 setGraph 展示给定点（warn）、候选圆心（compare）与最优圆心（final），
// setAux 展示半径变化。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxEmptyCircle, type Point, type BBox, type MaxEmptyCircleHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  points: [
    { x: 2, y: 2 },
    { x: 6, y: 3 },
    { x: 8, y: 7 },
    { x: 3, y: 6 },
    { x: 5, y: 5 },
  ] as Point[],
  bbox: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 } as BBox,
};

interface BuildTraceInput {
  points?: Point[];
  bbox?: BBox;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const points = input.points ?? DEFAULT_INPUT.points;
  const bbox = input.bbox ?? DEFAULT_INPUT.bbox;
  const rec = new TraceRecorder();

  const BX = bbox.xmax - bbox.xmin;
  const BY = bbox.ymax - bbox.ymin;
  const norm = (x: number, y: number) => ({
    x: (x - bbox.xmin) / BX,
    y: 1 - (y - bbox.ymin) / BY,
  });

  // 边界框四角节点
  const cornerNodes: GraphNode[] = [
    { id: 'c0', ...norm(bbox.xmin, bbox.ymin), role: 'frontier' as BarRole },
    { id: 'c1', ...norm(bbox.xmax, bbox.ymin), role: 'frontier' as BarRole },
    { id: 'c2', ...norm(bbox.xmax, bbox.ymax), role: 'frontier' as BarRole },
    { id: 'c3', ...norm(bbox.xmin, bbox.ymax), role: 'frontier' as BarRole },
  ];
  const boxEdges: GraphEdge[] = [
    { from: 'c0', to: 'c1', role: 'frontier' as BarRole },
    { from: 'c1', to: 'c2', role: 'frontier' as BarRole },
    { from: 'c2', to: 'c3', role: 'frontier' as BarRole },
    { from: 'c3', to: 'c0', role: 'frontier' as BarRole },
  ];
  const pointNodes: GraphNode[] = points.map((p, i) => ({
    id: `p${i}`,
    ...norm(p.x, p.y),
    role: 'warn' as BarRole,
    label: String(i),
  }));

  let bestRadius = 0;
  let bestNode: GraphNode | null = null;
  let candCount = 0;

  rec
    .begin({
      zh: `最大空圆：${points.length} 个点，边界 [${bbox.xmin},${bbox.ymin}]-[${bbox.xmax},${bbox.ymax}]`,
      en: `Max empty circle: ${points.length} points, box [${bbox.xmin},${bbox.ymin}]-[${bbox.xmax},${bbox.ymax}]`,
    })
    .setGraph([...cornerNodes, ...pointNodes], boxEdges)
    .setAux([
      { label: '点数', value: String(points.length), role: 'pivot' as BarRole },
      { label: '当前最优半径', value: '0.000', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: MaxEmptyCircleHooks = {
    onCandidate: (c, r, inside) => {
      if (!inside) return;
      candCount++;
      if (candCount > 30) return; // 限制帧数
      const np = norm(c.x, c.y);
      rec
        .begin({
          zh: `候选圆心 (${c.x.toFixed(2)},${c.y.toFixed(2)})，半径 ${r.toFixed(3)}`,
          en: `Candidate center (${c.x.toFixed(2)},${c.y.toFixed(2)}), radius ${r.toFixed(3)}`,
        })
        .setGraph(
          [
            ...cornerNodes,
            ...pointNodes,
            { id: `cand`, x: np.x, y: np.y, role: 'compare' as BarRole },
            ...(bestNode ? [bestNode] : []),
          ],
          boxEdges,
        )
        .setAux([
          { label: '候选半径', value: r.toFixed(3), role: 'compare' as BarRole },
          { label: '当前最优', value: bestRadius.toFixed(3), role: 'final' as BarRole },
        ])
        .commit();
    },
    onImprove: (center, r) => {
      bestRadius = r;
      const np = norm(center.x, center.y);
      bestNode = { id: 'best', x: np.x, y: np.y, role: 'final' as BarRole };
    },
  };

  const result = maxEmptyCircle(points, bbox, hooks);

  // 终态
  const np = norm(result.center.x, result.center.y);
  rec
    .begin({
      zh: `完成：最大空圆圆心 (${result.center.x.toFixed(2)},${result.center.y.toFixed(2)})，半径 ${result.radius.toFixed(3)}`,
      en: `Done: center (${result.center.x.toFixed(2)},${result.center.y.toFixed(2)}), radius ${result.radius.toFixed(3)}`,
    })
    .setGraph(
      [...cornerNodes, ...pointNodes, { id: 'best', x: np.x, y: np.y, role: 'final' as BarRole }],
      boxEdges,
    )
    .setAux([
      { label: '圆心 x', value: result.center.x.toFixed(3), role: 'pivot' as BarRole },
      { label: '圆心 y', value: result.center.y.toFixed(3), role: 'pivot' as BarRole },
      { label: '半径', value: result.radius.toFixed(3), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
