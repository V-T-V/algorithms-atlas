// =============================================================================
// 离散对数 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { discreteLog, type BsgsHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 2n, b: 3n, m: 5n };

export function buildTrace(input: { a: bigint; b: bigint; m: bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const babies: Array<{ j: string; val: string }> = [];
  const giants: Array<{ i: string; val: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        ...babies.map((b) => ({ label: `baby j=${b.j}`, value: b.val, role: 'frontier' as const })),
        ...giants.map((g) => ({ label: `giant i=${g.i}`, value: g.val, role: 'pivot' as const })),
      ])
      .commit();
  };

  snap({
    zh: `${input.a}^x ≡ ${input.b} (mod ${input.m})`,
    en: `${input.a}^x ≡ ${input.b} (mod ${input.m})`,
  });

  const hooks: BsgsHooks = {
    onBaby: (j, val) => {
      babies.push({ j: j.toString(), val: val.toString() });
      snap({ zh: `baby: a^${j}=${val}`, en: `baby: a^${j}=${val}` });
    },
    onGiant: (i, val) => {
      giants.push({ i: i.toString(), val: val.toString() });
      snap({ zh: `giant: i=${i}, b·a^(-in)=${val}`, en: `giant i=${i} val=${val}` });
    },
  };

  const ans = discreteLog(input.a, input.b, input.m, hooks);

  rec
    .begin({
      zh: ans === null ? '无解' : `x=${ans}`,
      en: ans === null ? 'no solution' : `x=${ans}`,
    })
    .setAux([{ label: '答案', value: ans === null ? '无' : ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
