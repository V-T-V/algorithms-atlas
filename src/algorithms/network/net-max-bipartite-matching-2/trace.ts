// 二分匹配变种（Hopcroft-Karp）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopcroftKarp, type BipartiteInput, type HopcroftKarpHooks } from './impl.ts';

export const DEFAULT_INPUT: BipartiteInput = {
  nL: 4,
  nR: 4,
  edges: [
    { u: 0, v: 0 },
    { u: 0, v: 1 },
    { u: 1, v: 0 },
    { u: 1, v: 2 },
    { u: 2, v: 2 },
    { u: 2, v: 3 },
    { u: 3, v: 1 },
  ],
};

export function buildTrace(input: BipartiteInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `二分图：左侧 ${input.nL}，右侧 ${input.nR}，边数 ${input.edges.length}`,
      en: `Bipartite: |L|=${input.nL}, |R|=${input.nR}, |E|=${input.edges.length}`,
    })
    .setAux([{ label: '方法', value: 'Hopcroft-Karp 分层增广', role: 'pivot' }])
    .commit();

  const hooks: HopcroftKarpHooks = {
    onPhase: (phase: number) => {
      rec
        .begin({ zh: `第 ${phase} 阶段：BFS 分层`, en: `Phase ${phase}: BFS layering` })
        .setAux([{ label: '阶段', value: String(phase), role: 'frontier' as BarRole }])
        .commit();
    },
    onAugment: (path, total) => {
      rec
        .begin({
          zh: `增广：${path.map((p) => `L${p.u}-R${p.v}`).join(', ')}（匹配总数 ${total}）`,
          en: `Augment: ${path.map((p) => `L${p.u}-R${p.v}`).join(', ')} (total ${total})`,
        })
        .setAux([{ label: '增广对', value: JSON.stringify(path), role: 'swap' as BarRole }])
        .commit();
    },
    onResult: (matching, size) => {
      rec
        .begin({ zh: `最大匹配 = ${size}`, en: `Maximum matching = ${size}` })
        .setAux(
          matching.map((m) => ({ label: `L${m.u}`, value: `R${m.v}`, role: 'final' as BarRole })),
        )
        .commit();
    },
  };

  hopcroftKarp(input, hooks);
  return rec.build();
}
