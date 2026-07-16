import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { largePower, type LargePowerHooks } from './impl.ts';

export const DEFAULT_BASE = 2;
export const DEFAULT_EXP = 16;

export function buildTrace(base: number = DEFAULT_BASE, exp: number = DEFAULT_EXP): Frame[] {
  const rec = new TraceRecorder();
  const bits: Array<{ pos: number; bit: number }> = [];

  rec
    .begin({ zh: `${base}^${exp}`, en: `${base}^${exp}` })
    .setAux([
      { label: '底', value: String(base), role: 'frontier' },
      { label: '指', value: String(exp), role: 'frontier' },
    ])
    .commit();

  const hooks: LargePowerHooks = {
    onBit: (pos, bit, b, result) => {
      bits.push({ pos, bit });
      rec
        .begin({
          zh: `bit[${pos}]=${bit}，base=${b}，res=${result}`,
          en: `bit[${pos}]=${bit}, base=${b}, res=${result}`,
        })
        .setBars(
          bits.map((x) => ({ value: x.bit, role: (x.bit ? 'final' : 'default') as BarRole })),
        )
        .setAux([
          { label: '位', value: String(pos), role: 'frontier' },
          { label: 'bit', value: String(bit), role: bit ? 'final' : ('warn' as BarRole) },
          { label: '结果', value: result.toString(), role: 'final' },
        ])
        .commit();
    },
  };

  const ans = largePower(base, exp, hooks);

  rec
    .begin({ zh: `结果=${ans}`, en: `Result=${ans}` })
    .setAux([{ label: '结果', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
