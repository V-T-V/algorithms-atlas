// 累加数 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btAdditiveNumber, type BtAdditiveNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = '112358';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `判断「${input}」是否累加数`, en: `Is "${input}" an additive number?` })
    .setAux([{ label: 'num', value: input, role: 'pivot' }])
    .commit();

  const hooks: BtAdditiveNumberHooks = {
    onTerm: (a, b, sum) => {
      rec
        .begin({ zh: `${a} + ${b} = ${sum}`, en: `${a} + ${b} = ${sum}` })
        .setAux([{ label: 'step', value: `${a}+${b}=${sum}`, role: 'compare' }])
        .commit();
    },
  };

  const result = btAdditiveNumber(input, hooks);

  rec
    .begin({
      zh: `结论：${result ? '是' : '不是'}累加数`,
      en: `Result: ${result ? 'is' : 'is not'} additive`,
    })
    .setAux([{ label: '结论', value: result ? 'YES' : 'NO', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
