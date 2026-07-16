// =============================================================================
// 凸包 Graham 扫描 · 录制帧序列
// 用 setGraph 展示点集：节点 x/y 用归一化坐标（原始坐标映射到 0~1）；
// 边表示当前候选栈形成的折线（role:'frontier'），最终凸包边 role:'final'。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convexHull, type ConvexHullHooks, type Point } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
  { x: 2, y: 2 },
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 2, y: 3 },
  { x: 5, y: 2 },
];

/** 把原始点集归一化到 [0,1]×[0,1]（翻转 y 使屏幕上“上”为大 y）。 */
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
  // 留 10% 边距，并把 y 翻转（屏幕坐标 y 向下）
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

  // 当前候选栈（下标序列）
  let stack: number[] = [];
  let highlight: number[] = []; // 当前帧高亮的点
  let poppedNow = -1; // 当前帧刚弹出的点

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.map((p, i) => {
      const np = norm(p);
      let role: BarRole = 'default';
      if (stack.includes(i)) role = 'frontier';
      if (highlight.includes(i)) role = 'compare';
      if (i === poppedNow) role = 'warn';
      return {
        id: idOf(i),
        label: `${i}`,
        x: np.x,
        y: np.y,
        role,
      };
    });

    const edges: GraphEdge[] = [];
    // 候选栈连成折线
    for (let k = 0; k + 1 < stack.length; k++) {
      edges.push({
        from: idOf(stack[k]!),
        to: idOf(stack[k + 1]!),
        role: 'frontier',
      });
    }

    rec.begin(note).setGraph(nodes, edges).commit();
    highlight = [];
    poppedNow = -1;
  };

  render({ zh: `点集共 ${n} 个，求凸包`, en: `${n} points, find convex hull` });

  const hooks: ConvexHullHooks = {
    onPickAnchor: (anchor) => {
      const ai = input.findIndex((p) => p.x === anchor.x && p.y === anchor.y);
      highlight = ai >= 0 ? [ai] : [];
      render({
        zh: `极点（最下/最左）= 点 ${ai}，作为排序基准`,
        en: `Anchor (bottommost/leftmost) = point ${ai}, sort around it`,
      });
    },
    onSortByAngle: (order) => {
      highlight = order.slice();
      render({
        zh: `按极角排序后顺序：[${order.join(', ')}]`,
        en: `Order after polar-angle sort: [${order.join(', ')}]`,
      });
    },
    onPush: (i) => {
      if (!stack.includes(i)) stack.push(i);
      highlight = [i];
      render({
        zh: `压入点 ${i}（坐标 ${input[i]!.x},${input[i]!.y}）`,
        en: `Push point ${i} (${input[i]!.x},${input[i]!.y})`,
      });
    },
    onPop: (i) => {
      // 从栈中移除（若在末尾）
      const pos = stack.lastIndexOf(i);
      if (pos >= 0) stack.splice(pos, 1);
      poppedNow = i;
      render({
        zh: `非左转（右转/共线）：弹出点 ${i}`,
        en: `Not a left turn: pop point ${i}`,
      });
    },
  };

  const hull = convexHull(input, hooks);

  // 终态：用最终凸包顶点画闭合多边形（role:'final'）
  // 把结果按坐标匹配回原下标
  const hullIdx: number[] = hull.map((h) => input.findIndex((p) => p.x === h.x && p.y === h.y));
  stack = hullIdx.filter((i) => i >= 0);
  const nodes: GraphNode[] = input.map((p, i) => {
    const np = norm(p);
    return {
      id: idOf(i),
      label: `${i}`,
      x: np.x,
      y: np.y,
      role: stack.includes(i) ? 'final' : 'default',
    };
  });
  const edges: GraphEdge[] = [];
  for (let k = 0; k < stack.length; k++) {
    const a = stack[k]!;
    const b = stack[(k + 1) % stack.length]!;
    edges.push({ from: idOf(a), to: idOf(b), role: 'final' });
  }
  rec
    .begin({ zh: `凸包 ${stack.length} 个顶点`, en: `Convex hull has ${stack.length} vertices` })
    .setGraph(nodes, edges)
    .commit();

  return rec.build();
}
