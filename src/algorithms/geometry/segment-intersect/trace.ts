// =============================================================================
// 线段相交 · 录制帧序列
// 用 setGraph 展示两条线段的 4 个端点 +（若相交的）交点，
// role：相交='final'，不相交='warn'；setAux 展示叉积计算结果。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentIntersect, type Point, type Segment, type SegmentIntersectHooks } from './impl.ts';

export const DEFAULT_INPUT: Segment[] = [
  { p: { x: 0, y: 0 }, q: { x: 4, y: 4 } },
  { p: { x: 0, y: 4 }, q: { x: 4, y: 0 } },
];

/** 把所有点归一化到 [0,1]×[0,1]（翻转 y）。 */
function normalizer(points: Point[]): (p: Point) => { x: number; y: number } {
  if (points.length === 0) return () => ({ x: 0.5, y: 0.5 });
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.15;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

/** 求两线段交点（若规范相交）。 */
function intersectPoint(s1: Segment, s2: Segment): Point | null {
  const { p: p1, q: p2 } = s1;
  const { p: p3, q: p4 } = s2;
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 1e-12) return null; // 平行/共线
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }
  return null;
}

/** 录制演示帧序列。 */
export function buildTrace(input: Segment[] = DEFAULT_INPUT): Frame[] {
  const s1 = input[0]!;
  const s2 = input[1]!;
  const rec = new TraceRecorder();
  const allPts = [s1.p, s1.q, s2.p, s2.q];
  const norm = normalizer(allPts);
  const idOf = (label: string) => label;

  let crossInfo: { a: Point; b: Point; c: Point; value: number } | null = null;
  let result: { intersects: boolean; proper: boolean } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [
      { id: idOf('p1'), label: 'p1', x: norm(s1.p).x, y: norm(s1.p).y, role: 'pivot' },
      { id: idOf('p2'), label: 'p2', x: norm(s1.q).x, y: norm(s1.q).y, role: 'pivot' },
      { id: idOf('p3'), label: 'p3', x: norm(s2.p).x, y: norm(s2.p).y, role: 'frontier' },
      { id: idOf('p4'), label: 'p4', x: norm(s2.q).x, y: norm(s2.q).y, role: 'frontier' },
    ];
    // 交点
    const ip = intersectPoint(s1, s2);
    if (ip)
      nodes.push({ id: idOf('ix'), label: '交点', x: norm(ip).x, y: norm(ip).y, role: 'final' });

    const edges: GraphEdge[] = [
      { from: idOf('p1'), to: idOf('p2'), role: 'pivot' },
      { from: idOf('p3'), to: idOf('p4'), role: 'frontier' },
    ];

    const aux = [
      {
        label: '当前叉积',
        value: crossInfo
          ? `(${crossInfo.b.x - crossInfo.a.x},${crossInfo.b.y - crossInfo.a.y}) × (${crossInfo.c.x - crossInfo.a.x},${crossInfo.c.y - crossInfo.a.y}) = ${crossInfo.value.toFixed(2)}`
          : '—',
        role: 'compare' as BarRole,
      },
      {
        label: '叉积方向',
        value: crossInfo
          ? crossInfo.value > 0
            ? '左转（CCW）'
            : crossInfo.value < 0
              ? '右转（CW）'
              : '共线'
          : '—',
        role: (crossInfo && crossInfo.value === 0 ? 'warn' : 'compare') as BarRole,
      },
      {
        label: '判定结果',
        value: result
          ? result.intersects
            ? result.proper
              ? '规范相交'
              : '广义相交（端点相接/共线重叠）'
            : '不相交'
          : '待定',
        role: (result ? (result.intersects ? 'final' : 'warn') : 'default') as BarRole,
      },
    ];
    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
    crossInfo = null;
  };

  render({ zh: `线段 p1p2 与 p3p4`, en: `Segments p1p2 and p3p4` });

  const hooks: SegmentIntersectHooks = {
    onCross: (a, b, c, value) => {
      crossInfo = { a, b, c, value };
      render({
        zh: `叉积 (b-a)×(c-a) = ${value.toFixed(2)}`,
        en: `Cross product (b-a)×(c-a) = ${value.toFixed(2)}`,
      });
    },
    onProper: (proper) => {
      if (proper) {
        result = { intersects: true, proper: true };
        render({ zh: '方向异号 → 规范相交', en: 'Opposite signs → proper intersection' });
      }
    },
    onResult: (intersects) => {
      result = { intersects, proper: result?.proper ?? false };
      render({
        zh: intersects ? '线段相交' : '线段不相交',
        en: intersects ? 'Segments intersect' : 'Segments do NOT intersect',
      });
    },
  };

  const r = segmentIntersect(s1, s2, hooks);
  result = r;

  // 终态：用最终结果着色
  const role: BarRole = r.intersects ? 'final' : 'warn';
  const nodes: GraphNode[] = [
    { id: idOf('p1'), label: 'p1', x: norm(s1.p).x, y: norm(s1.p).y, role },
    { id: idOf('p2'), label: 'p2', x: norm(s1.q).x, y: norm(s1.q).y, role },
    { id: idOf('p3'), label: 'p3', x: norm(s2.p).x, y: norm(s2.p).y, role },
    { id: idOf('p4'), label: 'p4', x: norm(s2.q).x, y: norm(s2.q).y, role },
  ];
  const ip = intersectPoint(s1, s2);
  if (ip)
    nodes.push({ id: idOf('ix'), label: '交点', x: norm(ip).x, y: norm(ip).y, role: 'final' });
  rec
    .begin({
      zh: r.intersects ? `相交（${r.proper ? '规范' : '广义'}）` : '不相交',
      en: r.intersects ? `Intersect (${r.proper ? 'proper' : 'improper'})` : 'No intersection',
    })
    .setGraph(nodes, [
      { from: idOf('p1'), to: idOf('p2'), role },
      { from: idOf('p3'), to: idOf('p4'), role },
    ])
    .commit();

  return rec.build();
}
