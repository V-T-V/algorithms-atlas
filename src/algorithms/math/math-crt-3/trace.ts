// =============================================================================
// CRT · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crt, type CrtHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  remainders: [2, 3, 2],
  moduli: [3, 5, 7],
};

export function buildTrace(
  input: { remainders: Array<number | bigint>; moduli: Array<number | bigint> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const merges: Array<{ newR: string; newM: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(merges.map((m) => ({ value: Number(m.newM), role: 'frontier' })))
      .setAux(
        merges.map((m, i) => ({
          label: `step${i}`,
          value: `r=${m.newR} mod ${m.newM}`,
          role: 'pivot',
        })),
      )
      .commit();
  };

  snap({
    zh: `求解 ${input.remainders.map((r, i) => `x≡${r}(mod ${input.moduli[i]})`).join(', ')}`,
    en: 'CRT merge',
  });

  const hooks: CrtHooks = {
    onMerge: (_r1, _m1, _r2, _m2, newR, newM) => {
      merges.push({ newR: newR.toString(), newM: newM.toString() });
      snap({ zh: `合并后 x≡${newR} (mod ${newM})`, en: `Merged: x≡${newR} (mod ${newM})` });
    },
  };

  const r = crt(input.remainders, input.moduli, hooks);

  rec
    .begin({
      zh: r.remainder === null ? '无解' : `最小解=${r.remainder}（周期=${r.modulus}）`,
      en: r.remainder === null ? 'No solution' : `x=${r.remainder} (period ${r.modulus})`,
    })
    .setAux([
      {
        label: '答案',
        value: r.remainder === null ? '无解' : r.remainder.toString(),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
