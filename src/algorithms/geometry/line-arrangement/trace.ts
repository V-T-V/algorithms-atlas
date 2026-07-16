// =============================================================================
// 直线排列 · 录制帧序列
// 用 setGraph 展示直线（用长线段近似）与交点，逐步揭示交点。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lineArrangement, type Line, type LineArrangementHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 一般位置的 5 条直线
  lines: [
    { a: 1, b: 0, c: 0.3 }, // x = 0.3
    { a: 0, b: 1, c: 0.6 }, // y = 0.6
    { a: 1, b: -1, c: 0 }, // x - y = 0
    { a: 1, b: 1, c: 0.8 }, // x + y = 0.8
    { a: 2, b: 1, c: 1.0 }, // 2x + y = 1.0
  ] as Line[],
};

interface BuildTraceInput {
  lines?: Line[];
}

const BX = 1.5; // 归一化边界
const BY = 1.5;

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const lines = input.lines ?? DEFAULT_INPUT.lines;
  const rec = new TraceRecorder();

  // 把每条直线渲染为两个端点（在 [-BX,BX] 范围内取一段）
  const lineToNodes = (line: Line, idx: number): { nodes: GraphNode[]; edge: GraphEdge } => {
    const { a, b, c } = line;
    let p1: { x: number; y: number };
    let p2: { x: number; y: number };
    if (Math.abs(b) > 1e-9) {
      // y = (c - a·x)/b
      p1 = { x: -BX, y: (c - a * -BX) / b };
      p2 = { x: BX, y: (c - a * BX) / b };
    } else {
      // x = c/a
      const xv = c / a;
      p1 = { x: xv, y: -BY };
      p2 = { x: xv, y: BY };
    }
    const norm = (x: number, y: number) => ({
      x: (x + BX) / (2 * BX),
      y: 1 - (y + BY) / (2 * BY),
    });
    const n1 = norm(p1.x, p1.y);
    const n2 = norm(p2.x, p2.y);
    return {
      nodes: [
        { id: `l${idx}_a`, x: n1.x, y: n1.y, role: 'frontier' as BarRole },
        { id: `l${idx}_b`, x: n2.x, y: n2.y, role: 'frontier' as BarRole },
      ],
      edge: { from: `l${idx}_a`, to: `l${idx}_b`, role: 'default' as BarRole },
    };
  };

  // 初始：只画直线
  const lineParts = lines.map((l, i) => lineToNodes(l, i));
  const allLineNodes = lineParts.flatMap((p) => p.nodes);
  const allLineEdges = lineParts.map((p) => p.edge);

  rec
    .begin({
      zh: `直线排列：${lines.length} 条直线`,
      en: `Line arrangement: ${lines.length} lines`,
    })
    .setGraph(allLineNodes, allLineEdges)
    .setAux([
      { label: '直线数 n', value: String(lines.length), role: 'pivot' as BarRole },
      {
        label: 'C(n,2)',
        value: String((lines.length * (lines.length - 1)) / 2),
        role: 'compare' as BarRole,
      },
      {
        label: '预期面数',
        value: String((lines.length * (lines.length + 1)) / 2 + 1),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  const foundPoints: GraphNode[] = [];
  let foundCount = 0;

  const hooks: LineArrangementHooks = {
    onIntersect: (i, j, p) => {
      if (p) {
        foundCount++;
        foundPoints.push({
          id: `ij${i}_${j}`,
          x: (p.x + BX) / (2 * BX),
          y: 1 - (p.y + BY) / (2 * BY),
          role: 'final' as BarRole,
          label: `${i}-${j}`,
        });
        rec
          .begin({
            zh: `直线 ${i} 与 ${j} 相交于 (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`,
            en: `Line ${i} & ${j} intersect at (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`,
          })
          .setGraph([...allLineNodes, ...foundPoints], allLineEdges)
          .setAux([
            { label: '已发现交点', value: String(foundCount), role: 'final' as BarRole },
            { label: '当前对', value: `L${i}, L${j}`, role: 'swap' as BarRole },
          ])
          .commit();
      }
    },
  };

  const result = lineArrangement(lines, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${result.vertexCount} 个顶点，${result.edgeCount} 条边，${result.faceCount} 个面`,
      en: `Done: ${result.vertexCount} vertices, ${result.edgeCount} edges, ${result.faceCount} faces`,
    })
    .setGraph([...allLineNodes, ...foundPoints], allLineEdges)
    .setAux([
      { label: '顶点 V', value: String(result.vertexCount), role: 'final' as BarRole },
      { label: '边 E', value: String(result.edgeCount), role: 'pivot' as BarRole },
      { label: '面 F', value: String(result.faceCount), role: 'frontier' as BarRole },
      {
        label: '欧拉 V−E+F',
        value: String(result.vertexCount - result.edgeCount + result.faceCount),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
