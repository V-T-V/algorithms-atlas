// Nim 堆游戏 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameNimHeap, type GameNimHeapHooks } from './impl.ts';

export const DEFAULT_INPUT = { piles: [5, 11, 7], maxTake: 3 };

export function buildTrace(input: { piles: number[]; maxTake: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { piles, maxTake } = input;

  rec
    .begin({
      zh: `堆 [${piles.join(', ')}]，每堆每次最多取 ${maxTake}`,
      en: `Piles [${piles.join(', ')}], maxTake ${maxTake} per turn`,
    })
    .setBars(piles.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: 'maxTake', value: String(maxTake), role: 'pivot' }])
    .commit();

  const hooks: GameNimHeapHooks = {
    onNormalize: (norm) => {
      rec
        .begin({
          zh: `归一化（mod ${maxTake + 1}）：[${norm.join(', ')}]`,
          en: `Normalized (mod ${maxTake + 1}): [${norm.join(', ')}]`,
        })
        .setBars(norm.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit();
    },
    onSum: (sum) => {
      rec
        .begin({ zh: `归一化总和 = ${sum}`, en: `Normalized sum = ${sum}` })
        .setAux([{ label: 'sum', value: String(sum), role: 'pivot' }])
        .commit();
    },
  };

  const firstWins = gameNimHeap(piles, maxTake, hooks);

  rec
    .begin({
      zh: `结论：先手${firstWins ? '必胜' : '必败'}`,
      en: `Result: first player ${firstWins ? 'wins' : 'loses'}`,
    })
    .setBars([{ value: piles.reduce((a, b) => a + b, 0), role: 'final' as BarRole }])
    .setAux([
      { label: '结论', value: firstWins ? 'WIN' : 'LOSE', role: firstWins ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
