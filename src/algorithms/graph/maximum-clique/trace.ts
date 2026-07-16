// =============================================================================
// 最大团 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maximumClique, type GraphInput, type CliqueHooks } from './impl.ts';

/** 示例：K4 = A-B-C-D 全连，再加 E 连 A、B。最大团 {A,B,C,D} 大小 4。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'A', to: 'E' },
    { from: 'B', to: 'E' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.3, y: 0.25 },
  B: { x: 0.7, y: 0.25 },
  C: { x: 0.7, y: 0.7 },
  D: { x: 0.3, y: 0.7 },
  E: { x: 0.5, y: 0.45 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const inR = new Set<string>();
  let bestSize = 0;
  const bestSet = new Set<string>();
  let maximalCount = 0;

  const mkNodes = (): GraphNode[] =>
    nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (inR.has(id)) role = 'compare';
      if (bestSet.has(id) && bestSize === bestSet.size) role = 'final';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role: (inR.has(e.from) && inR.has(e.to) ? 'compare' : 'default') as BarRole,
    }));

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(mkNodes(), mkEdges())
      .setAux([
        { label: '当前 R', value: inR.size ? [...inR].join(',') : '∅', role: 'compare' },
        {
          label: '最大团',
          value: bestSize ? `{${[...bestSet].join(',')}} (${bestSize})` : '（未发现）',
          role: 'final',
        },
        { label: '极大团数', value: String(maximalCount) },
      ])
      .commit();
  };

  snap({ zh: '初始图：Bron-Kerbosch 求最大团', en: 'Initial graph: Bron-Kerbosch for max clique' });

  const hooks: CliqueHooks = {
    onExpand: (R) => {
      inR.clear();
      for (const v of R) inR.add(v);
      snap({ zh: `扩展 R={${R.join(',')}}`, en: `Expand R={${R.join(',')}}` });
    },
    onClique: (clique) => {
      maximalCount++;
      inR.clear();
      for (const v of clique) inR.add(v);
      if (clique.length > bestSize) {
        bestSize = clique.length;
        bestSet.clear();
        for (const v of clique) bestSet.add(v);
      }
      snap({
        zh: `极大团 {${clique.join(',')}}（大小 ${clique.length}）`,
        en: `Maximal clique {${clique.join(',')}} (${clique.length})`,
      });
    },
    onResult: (mc, size) => {
      inR.clear();
      bestSet.clear();
      for (const v of mc) bestSet.add(v);
      bestSize = size;
      snap({ zh: `最大团大小 = ${size}`, en: `Max clique size = ${size}` });
    },
  };

  maximumClique(input, hooks);

  rec
    .begin({
      zh: `完成：最大团 {${[...bestSet].join(',')}} 大小 ${bestSize}`,
      en: `Done: max clique {${[...bestSet].join(',')}} size ${bestSize}`,
    })
    .setGraph(mkNodes(), mkEdges())
    .setAux([{ label: '最大团', value: String(bestSize), role: 'final' }])
    .commit();

  return rec.build();
}
