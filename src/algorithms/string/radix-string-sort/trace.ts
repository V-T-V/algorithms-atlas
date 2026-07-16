// =============================================================================
// 字符串基数排序（MSD）· 录制帧序列
// setAux 展示当前数组与分桶进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixStringSort, type RadixStringSortHooks } from './impl.ts';

export const DEFAULT_INPUT = ['she', 'shells', 'sea', 'shore', 'by', 'the'];

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const words = input;
  let arr = [...words];
  let note = '';
  let digitCalls = 0;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'array', value: arr.join(' | ') },
    { label: 'digit', value: note },
    { label: 'passes', value: String(digitCalls), role: 'compare' },
  ];

  const snap = (n: { zh: string; en: string }): void => {
    rec.begin(n).setAux(aux()).commit();
    note = '';
  };

  snap({ zh: `MSD 基数排序：${words.join(', ')}`, en: `MSD radix sort: ${words.join(', ')}` });

  const hooks: RadixStringSortHooks = {
    onDigit: (lo, hi, d) => {
      digitCalls++;
      note = `digit ${d}: [${lo},${hi})`;
      snap({ zh: `第 ${d} 位分桶 [${lo},${hi})`, en: `Bucket by digit ${d}` });
    },
    onDistribute: () => {},
    onDone: (sorted) => {
      arr = sorted;
    },
  };

  arr = radixStringSort(words, hooks);

  snap({ zh: `完成：${arr.join(', ')}`, en: `Done: ${arr.join(', ')}` });
  return rec.build();
}
