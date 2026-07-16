// =============================================================================
// Lucas 序列 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lucasSequence, type LucasSequenceHooks } from './impl.ts';

export const DEFAULT_INPUT: { P: number; Q: number; n: number } = { P: 1, Q: -1, n: 15 };

export function buildTrace(input: { P: number; Q: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { P, Q, n } = input;

  rec
    .begin({
      zh: `计算 Lucas 序列 U_${n}(${P},${Q}) 与 V_${n}(${P},${Q})`,
      en: `Compute Lucas U_${n}(${P},${Q}) and V_${n}(${P},${Q})`,
    })
    .setAux([
      { label: 'P', value: String(P), role: 'frontier' },
      { label: 'Q', value: String(Q), role: 'frontier' },
      { label: 'n', value: String(n), role: 'frontier' },
    ])
    .commit();

  const hooks: LucasSequenceHooks = {
    onStep: (bit, a, b, c, d) => {
      rec
        .begin({
          zh: `指数位=${bit}，base=[[${a},${b}],[${c},${d}]]`,
          en: `bit=${bit}, base=[[${a},${b}],[${c},${d}]]`,
        })
        .setAux([
          { label: '位', value: String(bit), role: 'compare' },
          { label: 'base', value: `[[${a},${b}],[${c},${d}]]`, role: 'frontier' },
        ])
        .commit();
    },
  };

  const { U, V } = lucasSequence(P, Q, n, hooks);

  rec
    .begin({ zh: `U_${n}=${U}, V_${n}=${V}`, en: `U_${n}=${U}, V_${n}=${V}` })
    .setAux([
      { label: `U_${n}`, value: U.toString(), role: 'final' },
      { label: `V_${n}`, value: V.toString(), role: 'final' },
    ])
    .commit();

  return rec.build();
}
