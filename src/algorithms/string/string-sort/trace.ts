// =============================================================================
// 字符串排序（归并）· 录制帧序列
// setAux 展示当前数组快照与合并段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stringSort, type StringSortHooks } from './impl.ts';

export const DEFAULT_INPUT = ['banana', 'apple', 'cherry', 'date', 'elderberry'];

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const words = input;
  let arr = [...words];
  let merges = 0;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'array', value: arr.join(' | ') },
    { label: 'merges', value: String(merges), role: 'compare' },
  ];

  const snap = (n: { zh: string; en: string }): void => {
    rec.begin(n).setAux(aux()).commit();
  };

  snap({ zh: `字符串排序：${words.join(', ')}`, en: `Sort: ${words.join(', ')}` });

  const hooks: StringSortHooks = {
    onCompare: () => {},
    onMerge: (lo, mid, hi) => {
      merges++;
      snap({
        zh: `合并 [${lo},${mid}) + [${mid},${hi})（第 ${merges} 次）`,
        en: `Merge [${lo},${mid}) + [${mid},${hi})`,
      });
    },
    onDone: (sorted) => {
      arr = sorted;
    },
  };

  arr = stringSort(words, hooks);

  snap({ zh: `完成：${arr.join(', ')}`, en: `Done: ${arr.join(', ')}` });
  return rec.build();
}
