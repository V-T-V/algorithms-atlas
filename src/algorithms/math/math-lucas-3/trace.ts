// =============================================================================
// Lucas · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lucas, type LucasHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 1000n, k: 300n, p: 13n };

export function buildTrace(input: { n: bigint; k: bigint; p: bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const digits: Array<{ ni: string; ki: string }> = [];
  let result = 1n;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(digits.map((d) => ({ value: Number(d.ni), role: 'pivot' })))
      .setAux(
        digits.map((d, i) => ({
          label: `digit${i}`,
          value: `n_i=${d.ni} k_i=${d.ki}`,
          role: 'frontier',
        })),
      )
      .commit();
  };

  snap({
    zh: `C(${input.n},${input.k}) mod ${input.p}`,
    en: `C(${input.n},${input.k}) mod ${input.p}`,
  });

  const hooks: LucasHooks = {
    onDigit: (ni, ki, partial) => {
      digits.push({ ni: ni.toString(), ki: ki.toString() });
      result = partial;
      snap({
        zh: `digit: n_i=${ni} k_i=${ki}, 累积=${partial}`,
        en: `digit ni=${ni} ki=${ki} partial=${partial}`,
      });
    },
  };

  const ans = lucas(input.n, input.k, input.p, hooks);

  rec
    .begin({ zh: `C(${input.n},${input.k}) mod ${input.p} = ${ans}`, en: `C mod p = ${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  void result;
  return rec.build();
}
