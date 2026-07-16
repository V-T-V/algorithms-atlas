// =============================================================================
// 次小生成树 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secondMst, type SecondMstHooks, type WeightedGraphInput } from './impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'A', to: 'D', weight: 4 },
    { from: 'A', to: 'C', weight: 10 },
  ],
};

export function buildTrace(input: WeightedGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let result = { mstWeight: 0, secondBest: Infinity };

  const hooks: SecondMstHooks = {
    onMst: (total) => {
      rec
        .begin({ zh: `MST 权值=${total}`, en: `MST weight=${total}` })
        .setAux([{ label: 'MST', value: String(total), role: 'final' }])
        .commit();
    },
    onTryNonTree: (from, to, w, mx, cand) => {
      rec
        .begin({
          zh: `非树边 ${from}-${to}(w=${w})，路径最大=${mx}，候选=${cand}`,
          en: `Non-tree ${from}-${to}(w=${w}), maxOnPath=${mx}, cand=${cand}`,
        })
        .setAux([
          { label: '边', value: `${from}-${to}`, role: 'compare' },
          { label: '增量', value: String(w - mx), role: 'pivot' },
          { label: '候选', value: String(cand), role: 'frontier' },
        ])
        .commit();
    },
    onDone: (sb) => {
      rec
        .begin({
          zh: Number.isFinite(sb) ? `次小=${sb}` : '无次小',
          en: Number.isFinite(sb) ? `Second=${sb}` : 'None',
        })
        .setAux([
          { label: '次小生成树', value: Number.isFinite(sb) ? String(sb) : '∞', role: 'final' },
        ])
        .commit();
    },
  };

  result = secondMst(input, hooks);
  return rec.build();
}
