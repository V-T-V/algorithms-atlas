// =============================================================================
// 平面扫描线（通用框架）· 录制帧序列
// 用 setBars 展示扫描过程中的「活动区间数」，用 setArray 展示当前累计并集长度。
// 实际用 setAux + 一组 bars 表示区间，扫描位置用 pivot 标记。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sweepIntervalUnion, type Interval, type PlaneSweepHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  intervals: [
    { l: 1, r: 4 },
    { l: 2, r: 5 },
    { l: 7, r: 9 },
    { l: 8, r: 10 },
    { l: 3, r: 6 },
  ] as Interval[],
};

interface BuildTraceInput {
  intervals?: Interval[];
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const intervals = input.intervals ?? DEFAULT_INPUT.intervals;
  const rec = new TraceRecorder();

  const allX = intervals.flatMap((itv) => [itv.l, itv.r]);
  const maxX = Math.max(...allX, 1);

  // 把区间渲染为图节点（两端点）+ 边（水平线段）
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  intervals.forEach((itv, i) => {
    nodes.push({
      id: `i${i}l`,
      x: itv.l / maxX,
      y: 0.3 + (i / intervals.length) * 0.4,
      role: 'default' as BarRole,
    });
    nodes.push({
      id: `i${i}r`,
      x: itv.r / maxX,
      y: 0.3 + (i / intervals.length) * 0.4,
      role: 'default' as BarRole,
    });
    edges.push({ from: `i${i}l`, to: `i${i}r`, role: 'default' as BarRole });
  });

  // 初始帧
  rec
    .begin({
      zh: `平面扫描线：${intervals.length} 个区间，求并集长度`,
      en: `Plane sweep: ${intervals.length} intervals, compute union length`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '区间数', value: String(intervals.length), role: 'pivot' as BarRole },
      { label: '并集长度', value: '0.000', role: 'final' as BarRole },
    ])
    .commit();

  let sweepX = 0;

  const hooks: PlaneSweepHooks = {
    onEvent: (x, count, total) => {
      sweepX = x / maxX;
      // 在扫描位置画一条竖线（用一个节点 + 与之连接的边近似）
      const sweepNode: GraphNode = { id: 'sweep', x: sweepX, y: 0.5, role: 'swap' as BarRole };
      // 给当前活动区间高亮
      const activeEdges: GraphEdge[] = edges.map((e, i) => {
        const itv = intervals[i]!;
        const inside = x > itv.l && x < itv.r;
        return { ...e, role: (inside ? 'final' : 'default') as BarRole };
      });
      rec
        .begin({
          zh: `扫描到 x=${x}，活动区间数 ${count}，累计并集 ${total}`,
          en: `Sweep to x=${x}, active intervals ${count}, union so far ${total}`,
        })
        .setGraph([...nodes, sweepNode], activeEdges)
        .setAux([
          { label: '扫描位置 x', value: String(x), role: 'swap' as BarRole },
          { label: '活动区间数', value: String(count), role: 'compare' as BarRole },
          { label: '并集长度', value: total.toFixed(3), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const total = sweepIntervalUnion(intervals, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：区间并集长度 = ${total}`,
      en: `Done: interval union length = ${total}`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '并集长度', value: total.toFixed(3), role: 'final' as BarRole },
      { label: '区间数', value: String(intervals.length), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
