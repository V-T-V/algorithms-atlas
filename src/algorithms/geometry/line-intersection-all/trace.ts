// =============================================================================
// 所有线段交点（Bentley-Ottmann）· 录制帧序列
// 用 setGraph 展示所有线段（端点=frontier）、扫描线位置（swap）与交点（final）。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findAllIntersections, type Segment, type AllIntersectHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  segments: [
    { p: { x: 1, y: 1 }, q: { x: 6, y: 5 } },
    { p: { x: 1, y: 5 }, q: { x: 6, y: 1 } },
    { p: { x: 2, y: 3 }, q: { x: 7, y: 3 } },
    { p: { x: 3, y: 0 }, q: { x: 3, y: 6 } },
  ] as Segment[],
};

interface BuildTraceInput {
  segments?: Segment[];
}

const BX = 8;
const BY = 7;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const segments = input.segments ?? DEFAULT_INPUT.segments;
  const rec = new TraceRecorder();

  // 线段渲染为节点对 + 边
  const segNodes: GraphNode[] = [];
  const segEdges: GraphEdge[] = [];
  segments.forEach((s, i) => {
    segNodes.push({ id: `s${i}a`, ...norm(s.p.x, s.p.y), role: 'frontier' as BarRole });
    segNodes.push({ id: `s${i}b`, ...norm(s.q.x, s.q.y), role: 'frontier' as BarRole });
    segEdges.push({ from: `s${i}a`, to: `s${i}b`, role: 'default' as BarRole });
  });

  const intersectionNodes: GraphNode[] = [];
  let frameCount = 0;
  const MAX_FRAMES = 10;

  rec
    .begin({
      zh: `Bentley-Ottmann：${segments.length} 条线段，求所有交点`,
      en: `Bentley-Oottmann: ${segments.length} segments, find all intersections`,
    })
    .setGraph(segNodes, segEdges)
    .setAux([
      { label: '线段数', value: String(segments.length), role: 'pivot' as BarRole },
      { label: '已发现交点', value: '0', role: 'final' as BarRole },
    ])
    .commit();

  const hooks: AllIntersectHooks = {
    onEndpoint: (idx, pt, isLeft, activeCount) => {
      if (frameCount >= MAX_FRAMES) return;
      frameCount++;
      // 扫描线位置
      const sweepNode: GraphNode = {
        id: 'sweep',
        x: pt.x / BX,
        y: 0.5,
        role: 'swap' as BarRole,
      };
      rec
        .begin({
          zh: `线段 ${idx} ${isLeft ? '左' : '右'}端点 (${pt.x.toFixed(1)},${pt.y.toFixed(1)})，活动 ${activeCount} 条`,
          en: `Segment ${idx} ${isLeft ? 'left' : 'right'} endpoint (${pt.x.toFixed(1)},${pt.y.toFixed(1)}), ${activeCount} active`,
        })
        .setGraph([...segNodes, ...intersectionNodes, sweepNode], segEdges)
        .setAux([
          { label: '扫描 x', value: pt.x.toFixed(2), role: 'swap' as BarRole },
          { label: '活动线段', value: String(activeCount), role: 'compare' as BarRole },
          { label: '交点数', value: String(intersectionNodes.length), role: 'final' as BarRole },
        ])
        .commit();
    },
    onIntersection: (ip) => {
      intersectionNodes.push({
        id: `ip${intersectionNodes.length}`,
        ...norm(ip.point.x, ip.point.y),
        role: 'final' as BarRole,
        label: '×',
      });
      if (frameCount >= MAX_FRAMES) return;
      frameCount++;
      const sweepNode: GraphNode = {
        id: 'sweep',
        x: ip.point.x / BX,
        y: 0.5,
        role: 'swap' as BarRole,
      };
      rec
        .begin({
          zh: `发现交点 (${ip.point.x.toFixed(2)},${ip.point.y.toFixed(2)})：线段 ${ip.i} 与 ${ip.j}`,
          en: `Intersection (${ip.point.x.toFixed(2)},${ip.point.y.toFixed(2)}): segments ${ip.i} & ${ip.j}`,
        })
        .setGraph([...segNodes, ...intersectionNodes, sweepNode], segEdges)
        .setAux([
          {
            label: '新交点',
            value: `(${ip.point.x.toFixed(2)},${ip.point.y.toFixed(2)})`,
            role: 'final' as BarRole,
          },
          { label: '线段对', value: `${ip.i}, ${ip.j}`, role: 'compare' as BarRole },
          { label: '交点总数', value: String(intersectionNodes.length), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = findAllIntersections(segments, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：共 ${result.length} 个交点`,
      en: `Done: ${result.length} intersections in total`,
    })
    .setGraph([...segNodes, ...intersectionNodes], segEdges)
    .setAux([{ label: '交点总数', value: String(result.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
