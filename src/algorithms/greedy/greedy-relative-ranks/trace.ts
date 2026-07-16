// 相对名次 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyRelativeRanks, type GreedyRelativeRanksHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 4, 3, 2, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `分数 [${input.join(', ')}]`, en: `Scores [${input.join(', ')}]` })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyRelativeRanksHooks = {
    onRank: (index, rank, medal) => {
      rec
        .begin({
          zh: `选手 ${index} 第 ${rank} 名：${medal}`,
          en: `Athlete ${index} rank ${rank}: ${medal}`,
        })
        .setBars(
          input.map((v, i) => ({ value: v, role: (i === index ? 'final' : 'default') as BarRole })),
        )
        .setAux([{ label: '名次', value: medal, role: 'final' }])
        .commit();
    },
  };

  const result = greedyRelativeRanks(input, hooks);

  rec
    .begin({ zh: `完成：[${result.join(', ')}]`, en: `Done: [${result.join(', ')}]` })
    .setAux([{ label: '名次', value: result.join(' | '), role: 'final' }])
    .commit();

  return rec.build();
}
