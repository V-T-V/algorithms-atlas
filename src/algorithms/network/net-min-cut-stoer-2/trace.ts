// Stoer-Wagner 全局最小割 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoerWagner2, type StoerWagner2Input, type StoerWagner2Hooks } from './impl.ts';

export const DEFAULT_INPUT: StoerWagner2Input = {
  n: 4,
  edges: [
    { from: 0, to: 1, w: 3 },
    { from: 1, to: 2, w: 2 },
    { from: 2, to: 3, w: 4 },
    { from: 0, to: 3, w: 1 },
    { from: 1, to: 3, w: 2 },
  ],
};

export function buildTrace(input: StoerWagner2Input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const edgeDesc = input.edges.map((e) => `${e.from}-${e.to}(${e.w})`).join(', ');
  rec
    .begin({ zh: `无向加权图：${edgeDesc}`, en: `Undirected weighted graph: ${edgeDesc}` })
    .setAux([{ label: '目标', value: '求全局最小割', role: 'pivot' }])
    .commit();

  let phase = 0;
  const hooks: StoerWagner2Hooks = {
    onPhase: (a, b, cut) => {
      phase++;
      rec
        .begin({
          zh: `阶段 ${phase}：割 (${a}|${b}) = ${cut}`,
          en: `Phase ${phase}: cut (${a}|${b}) = ${cut}`,
        })
        .setAux([
          { label: '阶段割', value: String(cut), role: 'frontier' as BarRole },
          { label: '最后两点', value: `${a}, ${b}`, role: 'compare' as BarRole },
        ])
        .commit();
    },
    onMerge: (a, b) => {
      rec
        .begin({ zh: `合并顶点 ${b} → ${a}`, en: `Merge vertex ${b} into ${a}` })
        .setAux([{ label: '合并', value: `${b}→${a}`, role: 'swap' as BarRole }])
        .commit();
    },
    onResult: (minCut) => {
      rec
        .begin({ zh: `全局最小割 = ${minCut}`, en: `Global min-cut = ${minCut}` })
        .setAux([{ label: '最小割', value: String(minCut), role: 'final' as BarRole }])
        .commit();
    },
  };

  stoerWagner2(input, hooks);
  return rec.build();
}
