// =============================================================================
// 多边形三角剖分（耳切法）· 录制帧序列
// 用 setGraph 展示多边形与已剪下的三角形（彩色填充边）。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { triangulate, type Point, type TriangulationHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 逆时针凹多边形（星形）
  polygon: [
    { x: 0, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 5 },
    { x: 2, y: 3 },
    { x: 1, y: 6 },
    { x: 0, y: 4 },
  ] as Point[],
};

interface BuildTraceInput {
  polygon?: Point[];
}

const BX = 6;
const BY = 6;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const polygon = input.polygon ?? DEFAULT_INPUT.polygon;
  const rec = new TraceRecorder();

  const baseNodes: GraphNode[] = polygon.map((p, i) => {
    const np = norm(p.x, p.y);
    return { id: `v${i}`, label: String(i), x: np.x, y: np.y, role: 'default' as BarRole };
  });
  const baseEdges: GraphEdge[] = polygon.map((_, i) => ({
    from: `v${i}`,
    to: `v${(i + 1) % polygon.length}`,
    role: 'default' as BarRole,
  }));

  rec
    .begin({
      zh: `多边形三角剖分（${polygon.length} 个顶点，预期 ${polygon.length - 2} 个三角形）`,
      en: `Polygon triangulation (${polygon.length} vertices, expect ${polygon.length - 2} triangles)`,
    })
    .setGraph(baseNodes, baseEdges)
    .setAux([
      { label: '顶点数 n', value: String(polygon.length), role: 'pivot' as BarRole },
      { label: '预期三角形', value: String(polygon.length - 2), role: 'frontier' as BarRole },
    ])
    .commit();

  const clippedEdges: GraphEdge[] = [];
  let triCount = 0;

  const hooks: TriangulationHooks = {
    onClipEar: (prev, i, next, remaining) => {
      triCount++;
      clippedEdges.push(
        { from: `v${prev}`, to: `v${i}`, role: 'final' as BarRole },
        { from: `v${i}`, to: `v${next}`, role: 'final' as BarRole },
        { from: `v${prev}`, to: `v${next}`, role: 'swap' as BarRole },
      );
      rec
        .begin({
          zh: `剪耳 (${prev}, ${i}, ${next})，剩 ${remaining} 个顶点`,
          en: `Clip ear (${prev}, ${i}, ${next}), ${remaining} vertices remain`,
        })
        .setGraph(baseNodes, [...baseEdges, ...clippedEdges])
        .setAux([
          { label: '已剪三角形', value: String(triCount), role: 'final' as BarRole },
          { label: '剩余顶点', value: String(remaining), role: 'pivot' as BarRole },
        ])
        .commit();
    },
  };

  const triangles = triangulate(polygon, hooks);

  // 终态：把最后那个三角形的边也加入
  if (triangles.length > 0) {
    const last = triangles[triangles.length - 1]!;
    clippedEdges.push(
      { from: `v${last.a}`, to: `v${last.b}`, role: 'final' as BarRole },
      { from: `v${last.b}`, to: `v${last.c}`, role: 'final' as BarRole },
      { from: `v${last.a}`, to: `v${last.c}`, role: 'swap' as BarRole },
    );
  }

  rec
    .begin({
      zh: `完成：共 ${triangles.length} 个三角形`,
      en: `Done: ${triangles.length} triangles in total`,
    })
    .setGraph(baseNodes, [...baseEdges, ...clippedEdges])
    .setAux([
      { label: '三角形数', value: String(triangles.length), role: 'final' as BarRole },
      {
        label: '是否 = n−2',
        value: triangles.length === polygon.length - 2 ? '是' : '否',
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
