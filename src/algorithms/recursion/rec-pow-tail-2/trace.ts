// 快速幂（尾递归）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fastPowTail } from './impl.ts';

export const DEFAULT_INPUT = { base: 2, exp: 10 };

export function buildTrace(input: { base: number; exp: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `${input.base}^${input.exp}（尾递归快速幂）`,
      en: `${input.base}^${input.exp} (tail-recursive fast pow)`,
    })
    .setAux([
      { label: 'base', value: String(input.base), role: 'pivot' },
      { label: 'exp', value: String(input.exp), role: 'frontier' },
      { label: 'acc', value: '1', role: 'final' },
    ])
    .commit();

  const hooks = {
    onStep: (base: number, exp: number, acc: number) => {
      rec
        .begin({
          zh: `e=${exp} ${exp % 2 === 0 ? '偶→b²,e/2' : '奇→acc*b,e-1'}`,
          en: `e=${exp} ${exp % 2 === 0 ? 'even→b²,e/2' : 'odd→acc*b,e-1'}`,
        })
        .setAux([
          { label: 'base', value: String(base), role: 'pivot' as BarRole },
          { label: 'exp', value: String(exp), role: 'frontier' as BarRole },
          { label: 'acc', value: String(acc), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const r = fastPowTail(input.base, input.exp, hooks);

  rec
    .begin({ zh: `${input.base}^${input.exp} = ${r}`, en: `${input.base}^${input.exp} = ${r}` })
    .setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
