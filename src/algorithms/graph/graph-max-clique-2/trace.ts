// =============================================================================
// 最大团 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxClique, type GraphInput, type MaxCliqueHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let best: string[] = [];

  rec
    .begin({
      zh: `图：${input.nodes.length} 节点 ${input.edges.length} 边`,
      en: `Graph: ${input.nodes.length}V ${input.edges.length}E`,
    })
    .commit();

  const hooks: MaxCliqueHooks = {
    onExtend: (clique, cand) => {
      rec
        .begin({
          zh: `扩展 R=[${clique.join(',')}] P=[${cand.join(',')}]`,
          en: `Extend R=[${clique.join(',')}] P=[${cand.join(',')}]`,
        })
        .setAux([
          { label: '当前团', value: clique.join(',') || '-', role: 'pivot' },
          { label: '候选', value: cand.join(',') || '-', role: 'frontier' },
        ])
        .commit();
    },
    onBetter: (size, clique) => {
      best = clique;
      rec
        .begin({
          zh: `新最优：${size} 团 [${clique.join(',')}]`,
          en: `New best: ${size} [${clique.join(',')}]`,
        })
        .setBars(clique.map((v) => ({ value: v.length, role: 'final' as const })))
        .setAux([{ label: '最优团', value: clique.join(','), role: 'final' }])
        .commit();
    },
    onDone: (size, clique) => {
      rec
        .begin({ zh: `最大团大小=${size}`, en: `Max clique size=${size}` })
        .setAux([{ label: '结果', value: clique.join(','), role: 'final' }])
        .commit();
    },
  };

  maxClique(input, hooks);
  return rec.build();
}
