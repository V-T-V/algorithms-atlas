// 重复博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameRepeatedGame, TIT_FOR_TAT, ALWAYS_DEFECT } from './impl.ts';
export const DEFAULT_INPUT = { rounds: 6 };
export function buildTrace(input: { rounds?: number } = {}): Frame[] {
  const { rounds = DEFAULT_INPUT.rounds } = input;
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: 'Tit-for-Tat vs Always-Defect（6 轮）',
      en: 'Tit-for-Tat vs Always-Defect (6 rounds)',
    })
    .setAux([{ label: '说明', value: 'TFT 首轮合作随后模仿对手', role: 'pivot' as BarRole }])
    .commit();
  let cum1 = 0;
  let cum2 = 0;
  gameRepeatedGame(TIT_FOR_TAT, ALWAYS_DEFECT, rounds, {
    onRound: (r, a1, a2, u1, u2) => {
      cum1 += u1;
      cum2 += u2;
      rec
        .begin({
          zh: `第 ${r} 轮：TFT=${a1}, AllD=${a2}，累计 (${cum1},${cum2})`,
          en: `Round ${r}: TFT=${a1}, AllD=${a2}, cum (${cum1},${cum2})`,
        })
        .setAux([
          { label: 'TFT 本轮', value: a1, role: 'compare' as BarRole },
          { label: 'AllD 本轮', value: a2, role: 'warn' as BarRole },
          { label: 'TFT 累计', value: String(cum1), role: 'final' as BarRole },
          { label: 'AllD 累计', value: String(cum2), role: 'final' as BarRole },
        ])
        .commit();
    },
  });
  return rec.build();
}
