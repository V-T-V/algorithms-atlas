// =============================================================================
// 模快速幂 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPow, type ModPowHooks } from './impl.ts';

export const DEFAULT_INPUT = { base: 2n, exp: 10n, m: 1000n };

export function buildTrace(
  input: { base: bigint; exp: bigint; m: bigint } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const bits: Array<{ i: number; bit: number; base: string; result: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(bits.map((b) => ({ value: Number(b.result), role: b.bit ? 'pivot' : 'frontier' })))
      .setAux(
        bits.map((b) => ({
          label: `i=${b.i}`,
          value: `bit=${b.bit} b=${b.base} r=${b.result}`,
          role: 'frontier',
        })),
      )
      .commit();
  };

  snap({
    zh: `${input.base}^${input.exp} mod ${input.m}`,
    en: `${input.base}^${input.exp} mod ${input.m}`,
  });

  const hooks: ModPowHooks = {
    onBit: (i, bit, base, result) => {
      bits.push({ i, bit, base: base.toString(), result: result.toString() });
      snap({
        zh: `bit ${i}=${bit}, base²=${base}, result=${result}`,
        en: `bit ${i}=${bit} base=${base} r=${result}`,
      });
    },
  };

  const ans = modPow(input.base, input.exp, input.m, hooks);

  rec
    .begin({ zh: `结果=${ans}`, en: `Result=${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
