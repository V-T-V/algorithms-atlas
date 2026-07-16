// 机制设计（VCG）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameMechanismDesign } from './impl.ts';
export const DEFAULT_INPUT = [10, 25, 18];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'VCG 单物品拍卖', en: 'VCG single-item auction' })
    .setBars(input.map((b, i) => ({ value: b, role: 'default' as BarRole, label: `b${i}=${b}` })))
    .commit();
  const r = gameMechanismDesign(input);
  rec
    .begin({
      zh: `中标 #${r.winnerIdx}，付 ${r.payments[r.winnerIdx]}`,
      en: `Winner #${r.winnerIdx}, pays ${r.payments[r.winnerIdx]}`,
    })
    .setBars(
      input.map((b, i) => ({
        value: b,
        role: (i === r.winnerIdx ? 'final' : 'default') as BarRole,
        label: `p${i}=${r.payments[i]}`,
      })),
    )
    .setAux([
      { label: 'VCG 收费', value: String(r.payments[r.winnerIdx]!), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
