// =============================================================================
// 合并两个凸包 · 录制帧序列
// 用 setGraph 展示两个凸包 H1（左）、H2（右）与合并后的凸包。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeConvexHulls, andrewMonotone, type Point, type MergeHullsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 左凸包（逆时针）
  H1: [
    { x: 0, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 2 },
    { x: 1, y: 0 },
  ] as Point[],
  // 右凸包（逆时针）
  H2: [
    { x: 5, y: 3 },
    { x: 7, y: 5 },
    { x: 9, y: 3 },
    { x: 7, y: 1 },
  ] as Point[],
};

interface BuildTraceInput {
  H1?: Point[];
  H2?: Point[];
}

const BX = 10;
const BY = 7;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const H1 = input.H1 ?? DEFAULT_INPUT.H1;
  const H2 = input.H2 ?? DEFAULT_INPUT.H2;
  const rec = new TraceRecorder();

  const polyEdges = (poly: Point[], idPrefix: string, color: BarRole): GraphEdge[] =>
    poly.map((_, i) => ({
      from: `${idPrefix}${i}`,
      to: `${idPrefix}${(i + 1) % poly.length}`,
      role: color,
    }));
  const polyNodes = (poly: Point[], idPrefix: string, color: BarRole): GraphNode[] =>
    poly.map((p, i) => ({
      id: `${idPrefix}${i}`,
      label: `${idPrefix}${i}`,
      ...norm(p.x, p.y),
      role: color,
    }));

  // 初始：两个独立凸包
  rec
    .begin({
      zh: `合并两个凸包：H1（左，${H1.length} 顶点）与 H2（右，${H2.length} 顶点）`,
      en: `Merge two hulls: H1 (left, ${H1.length} pts) and H2 (right, ${H2.length} pts)`,
    })
    .setGraph(
      [...polyNodes(H1, 'a', 'pivot'), ...polyNodes(H2, 'b', 'frontier')],
      [...polyEdges(H1, 'a', 'pivot'), ...polyEdges(H2, 'b', 'frontier')],
    )
    .setAux([
      { label: 'H1 顶点', value: String(H1.length), role: 'pivot' as BarRole },
      { label: 'H2 顶点', value: String(H2.length), role: 'frontier' as BarRole },
    ])
    .commit();

  const hooks: MergeHullsHooks = {
    onUpperTangent: (i, j) => {
      rec
        .begin({
          zh: `上公切线：H1[${i}] ↔ H2[${j}]`,
          en: `Upper tangent: H1[${i}] ↔ H2[${j}]`,
        })
        .setGraph(
          [...polyNodes(H1, 'a', 'pivot'), ...polyNodes(H2, 'b', 'frontier')],
          [
            ...polyEdges(H1, 'a', 'default'),
            ...polyEdges(H2, 'b', 'default'),
            { from: `a${i}`, to: `b${j}`, role: 'compare' as BarRole },
          ],
        )
        .setAux([{ label: '上切线', value: `a${i} ↔ b${j}`, role: 'compare' as BarRole }])
        .commit();
    },
    onLowerTangent: (i, j) => {
      rec
        .begin({
          zh: `下公切线：H1[${i}] ↔ H2[${j}]`,
          en: `Lower tangent: H1[${i}] ↔ H2[${j}]`,
        })
        .setGraph(
          [...polyNodes(H1, 'a', 'pivot'), ...polyNodes(H2, 'b', 'frontier')],
          [
            ...polyEdges(H1, 'a', 'default'),
            ...polyEdges(H2, 'b', 'default'),
            { from: `a${i}`, to: `b${j}`, role: 'swap' as BarRole },
          ],
        )
        .setAux([{ label: '下切线', value: `a${i} ↔ b${j}`, role: 'swap' as BarRole }])
        .commit();
    },
  };

  const merged = mergeConvexHulls(H1, H2, hooks);

  // 终态：合并后的凸包
  const mergedNodes: GraphNode[] = merged.map((p, i) => ({
    id: `m${i}`,
    ...norm(p.x, p.y),
    role: 'final' as BarRole,
  }));
  const mergedEdges: GraphEdge[] = merged.map((_, i) => ({
    from: `m${i}`,
    to: `m${(i + 1) % merged.length}`,
    role: 'final' as BarRole,
  }));
  rec
    .begin({
      zh: `完成：合并后凸包 ${merged.length} 顶点`,
      en: `Done: merged hull has ${merged.length} vertices`,
    })
    .setGraph(
      [...polyNodes(H1, 'a', 'default'), ...polyNodes(H2, 'b', 'default'), ...mergedNodes],
      [...polyEdges(H1, 'a', 'default'), ...polyEdges(H2, 'b', 'default'), ...mergedEdges],
    )
    .setAux([{ label: '合并顶点数', value: String(merged.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

export { andrewMonotone };
