// =============================================================================
// 最大独立集 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maximumIndependentSet, type GraphInput, type MisHooks } from './impl.ts';

/** 示例：路径 P5 = A-B-C-D-E，最大独立集 {A,C,E} 大小 3。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.3, y: 0.5 },
  C: { x: 0.5, y: 0.5 },
  D: { x: 0.7, y: 0.5 },
  E: { x: 0.9, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const chosen = new Set<string>();
  const remain = new Set<string>();
  let bestSize = 0;
  const bestSet = new Set<string>();
  let done = false;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (chosen.has(id)) role = 'compare';
      if (remain.has(id)) role = 'frontier';
      if (done && bestSet.has(id)) role = 'final';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '已选', value: chosen.size ? [...chosen].join(',') : '∅', role: 'compare' },
        { label: '剩余', value: remain.size ? `${remain.size} 点` : '∅', role: 'frontier' },
        {
          label: '当前最优',
          value: bestSize ? `${bestSize}: {${[...bestSet].join(',')}}` : '（无）',
          role: 'final',
        },
      ])
      .commit();
  };

  snap({ zh: '初始图：分支定界求 MIS', en: 'Initial graph: B&B for MIS' });

  const hooks: MisHooks = {
    onBranch: (c, r) => {
      chosen.clear();
      for (const v of c) chosen.add(v);
      remain.clear();
      for (const v of r) remain.add(v);
      snap({
        zh: `分支：选 {${c.join(',')}}，剩 ${r.length} 点`,
        en: `Branch: chosen {${c.join(',')}}, ${r.length} left`,
      });
    },
    onUpdate: (b) => {
      bestSet.clear();
      for (const v of b) bestSet.add(v);
      bestSize = b.length;
      snap({
        zh: `更新最优：{${b.join(',')}} (${b.length})`,
        en: `New best: {${b.join(',')}} (${b.length})`,
      });
    },
    onResult: (s, size) => {
      done = true;
      chosen.clear();
      remain.clear();
      bestSet.clear();
      for (const v of s) bestSet.add(v);
      bestSize = size;
      snap({ zh: `MIS 大小 = ${size}`, en: `MIS size = ${size}` });
    },
  };

  maximumIndependentSet(input, hooks);

  rec
    .begin({
      zh: `完成：MIS {${[...bestSet].join(',')}} 大小 ${bestSize}`,
      en: `Done: MIS {${[...bestSet].join(',')}} size ${bestSize}`,
    })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: 'MIS', value: String(bestSize), role: 'final' }])
    .commit();

  return rec.build();
}
