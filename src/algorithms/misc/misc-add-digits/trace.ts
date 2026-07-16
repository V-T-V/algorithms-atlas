// =============================================================================
// 反复加位数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addDigits, type AddDigitsHooks } from './impl.ts';

export const DEFAULT_INPUT = 38;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const iters: Array<{ cur: number; sum: number }> = [];

  rec
    .begin({ zh: `求 ${input} 的数根`, en: `Digital root of ${input}` })
    .setAux([{ label: '输入', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: AddDigitsHooks = {
    onIter: (cur, sum) => iters.push({ cur, sum }),
  };

  const result = addDigits(input, hooks);

  for (let i = 0; i < iters.length; i++) {
    const it = iters[i]!;
    rec
      .begin({
        zh: `第 ${i + 1} 次：${it.cur} 的各位和 = ${it.sum}`,
        en: `Iter ${i + 1}: digit sum of ${it.cur} = ${it.sum}`,
      })
      .setAux([
        { label: '当前数', value: String(it.cur), role: 'compare' as BarRole },
        { label: '各位和', value: String(it.sum), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `数根 = ${result}`, en: `Digital root = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
