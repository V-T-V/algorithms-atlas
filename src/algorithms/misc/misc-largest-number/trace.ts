// =============================================================================
// 最大数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { largestNumber, type LargestNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 30, 34, 5, 9];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const compares: Array<{ a: string; b: string; order: string }> = [];

  rec
    .begin({
      zh: `输入 [${input.join(',')}]，求最大拼接`,
      en: `Input [${input.join(',')}], find largest concat`,
    })
    .setAux(input.map((n, i) => ({ label: `n${i}`, value: String(n), role: 'pivot' as BarRole })))
    .commit();

  const hooks: LargestNumberHooks = {
    onCompare: (a, b, order) => compares.push({ a, b, order }),
  };

  const result = largestNumber(input, hooks);

  // 展示前若干次比较
  const show = compares.slice(0, 8);
  for (const c of show) {
    rec
      .begin({
        zh: `比较 "${c.a}" vs "${c.b}"：${c.order === 'a,b' ? `${c.a}${c.b} > ${c.b}${c.a}` : `${c.b}${c.a} >= ${c.a}${c.b}`}`,
        en: `Compare "${c.a}" vs "${c.b}": ${c.order}`,
      })
      .setAux([
        { label: 'a', value: c.a, role: 'compare' as BarRole },
        { label: 'b', value: c.b, role: 'compare' as BarRole },
        { label: '顺序', value: c.order, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `结果："${result}"`, en: `Result: "${result}"` })
    .setAux([{ label: '最大数', value: result, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
