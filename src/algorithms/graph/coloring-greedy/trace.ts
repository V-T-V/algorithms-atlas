// =============================================================================
// 贪心图着色 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coloringGreedy, type GraphInput, type ColoringHooks } from './impl.ts';

/** 示例：五边形 A-B-C-D-E-A + 弦 A-C（最大团 3，需 3 色）。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'A' },
    { from: 'A', to: 'C' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.5, y: 0.2 },
  B: { x: 0.85, y: 0.4 },
  C: { x: 0.7, y: 0.8 },
  D: { x: 0.3, y: 0.8 },
  E: { x: 0.15, y: 0.4 },
};

const COLOR_ROLE: BarRole[] = ['default', 'compare', 'swap', 'pivot', 'frontier', 'warn'];

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const colors = new Map<string, number>();
  let cur: string | null = null;
  let used = 0;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      const c = colors.get(id);
      const role: BarRole =
        id === cur
          ? 'compare'
          : c === undefined
            ? 'default'
            : (COLOR_ROLE[c % COLOR_ROLE.length] ?? 'final');
      return {
        id,
        label: c === undefined ? id : `${id}\n色${c}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        {
          label: '已分配',
          value:
            nodeIds
              .filter((n) => colors.has(n))
              .map((n) => `${n}:${colors.get(n)}`)
              .join('  ') || '∅',
        },
        { label: '用色数', value: String(used), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '初始图：按度数降序着色', en: 'Initial graph: color by degree desc' });

  const hooks: ColoringHooks = {
    onOrder: (order) => {
      snap({ zh: `顶点顺序：${order.join('→')}`, en: `Order: ${order.join('→')}` });
    },
    onColor: (v, c) => {
      colors.set(v, c);
      cur = v;
      if (c + 1 > used) used = c + 1;
      snap({ zh: `${v} ← 颜色 ${c}`, en: `${v} <- color ${c}` });
    },
    onResult: (_m, u) => {
      cur = null;
      snap({ zh: `完成：用 ${u} 种颜色`, en: `Done: ${u} colors used` });
    },
  };

  coloringGreedy(input, hooks);

  rec
    .begin({ zh: `完成：用 ${used} 种颜色`, en: `Done: ${used} colors` })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '色数', value: String(used), role: 'final' }])
    .commit();

  return rec.build();
}
