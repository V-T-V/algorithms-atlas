// =============================================================================
// 多边形面积 · 录制帧序列
// 用 setGraph 展示多边形（节点 x/y 归一化坐标，边按顺序连接），逐步高亮当前处理的边；
// 用 setAux 展示鞋带公式的累加过程。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonArea, signedArea, type Point, type PolygonAreaHooks } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 2, y: 5 },
  { x: 0, y: 3 },
];

/** 把原始点集归一化到 [0,1]×[0,1]（翻转 y 使屏幕上"上"为大 y）。 */
function normalizer(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  if (pts.length === 0) return () => ({ x: 0, y: 0 });
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.1;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: Point[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const norm = normalizer(input);
  const idOf = (i: number): string => `p${i}`;

  let curEdge = -1; // 当前处理的边下标
  let sum = 0;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.map((p, i) => {
      const np = norm(p);
      const role: BarRole = i === curEdge || i === (curEdge + 1) % n ? 'compare' : 'default';
      return {
        id: idOf(i),
        label: `${i}(${p.x},${p.y})`,
        x: np.x,
        y: np.y,
        role,
      };
    });
    const edges: GraphEdge[] = [];
    for (let i = 0; i < n; i++) {
      const role: BarRole = i === curEdge ? 'compare' : 'frontier';
      edges.push({
        from: idOf(i),
        to: idOf((i + 1) % n),
        role,
        directed: true,
      });
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '当前边',
        value: curEdge < 0 ? '—' : `${idOf(curEdge)}→${idOf((curEdge + 1) % n)}`,
        role: 'compare',
      },
      { label: 'Σ 叉积', value: sum.toFixed(2), role: 'frontier' },
      { label: '面积/2', value: (Math.abs(sum) / 2).toFixed(2), role: 'final' },
    ];
    rec.begin(note).setGraph(nodes, edges).setAux(aux).setMap(lines.slice()).commit();
  };

  render({
    zh: `多边形 ${n} 个顶点，用鞋带公式累加叉积`,
    en: `Polygon with ${n} vertices; accumulate cross products via shoelace`,
  });

  const hooks: PolygonAreaHooks = {
    onEdge: (i, cross) => {
      curEdge = i;
      const cur = input[i]!;
      const nxt = input[(i + 1) % n]!;
      lines.push({
        key: `边 ${i}`,
        value: `${cur.x}·${nxt.y} − ${nxt.x}·${cur.y} = ${cross}`,
        role: 'default',
      });
      render({
        zh: `处理边 ${i}：(p${i}, p${(i + 1) % n})，叉积 = ${cross}`,
        en: `Edge ${i}: (p${i}, p${(i + 1) % n}), cross = ${cross}`,
      });
    },
    onAccumulate: (s) => {
      sum = s;
    },
    onDone: (area) => {
      lines.push({ key: '结果', value: `面积 = |Σ|/2 = ${area}`, role: 'final' });
    },
  };

  const area = polygonArea(input, hooks);
  const sgn = signedArea(input);

  // 终态：所有边 final
  const nodes: GraphNode[] = input.map((p, i) => {
    const np = norm(p);
    return {
      id: idOf(i),
      label: `${i}(${p.x},${p.y})`,
      x: np.x,
      y: np.y,
      role: 'final',
    };
  });
  const edges: GraphEdge[] = [];
  for (let i = 0; i < n; i++) {
    edges.push({ from: idOf(i), to: idOf((i + 1) % n), role: 'final', directed: true });
  }
  rec
    .begin({
      zh: `完成：面积 = ${area}（${sgn > 0 ? '逆时针' : sgn < 0 ? '顺时针' : '退化'}）`,
      en: `Done: area = ${area} (${sgn > 0 ? 'CCW' : sgn < 0 ? 'CW' : 'degenerate'})`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '面积', value: area.toString(), role: 'final' },
      {
        label: '方向',
        value: sgn > 0 ? '逆时针 / CCW' : sgn < 0 ? '顺时针 / CW' : '退化',
        role: 'final',
      },
    ])
    .setMap(lines.slice())
    .commit();

  return rec.build();
}
