// =============================================================================
// 模逆元 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modInverse, type ModInvHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 3, p: 11 };

export function buildTrace(
  input: { a: number | bigint; p: number | bigint } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        { value: Number(input.a.toString()), role: 'frontier' },
        { value: Number(input.p.toString()), role: 'pivot' },
      ])
      .setAux([
        { label: 'a', value: String(input.a), role: 'frontier' },
        { label: 'p', value: String(input.p), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `求 ${input.a} 在模 ${input.p} 下的逆元`,
    en: `Inverse of ${input.a} mod ${input.p}`,
  });

  const hooks: ModInvHooks = {
    onPow: (e) => {
      rec
        .begin({
          zh: `计算 ${input.a}^${e} mod ${input.p}`,
          en: `Compute ${input.a}^${e} mod ${input.p}`,
        })
        .setAux([{ label: '指数', value: e.toString(), role: 'frontier' }])
        .commit();
    },
  };

  const inv = modInverse(input.a, input.p, hooks);

  rec
    .begin({
      zh: inv === null ? '不存在逆元' : `逆元=${inv}`,
      en: inv === null ? 'no inverse' : `inv=${inv}`,
    })
    .setAux([{ label: '答案', value: inv === null ? '无' : inv.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
