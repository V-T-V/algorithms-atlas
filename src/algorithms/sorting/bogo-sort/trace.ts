// =============================================================================
// 猴子排序 · 录制帧序列
// 通过 bogoSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bogoSort, type BogoSortHooks } from './impl.ts';

// 用很短的输入，避免尝试次数过多
export const DEFAULT_INPUT = [3, 1, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  const snapshot = (note: { zh: string; en: string }, role: BarRole = 'default'): void => {
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, role === 'default' ? {} : { 0: role, [a.length - 1]: role }))
      .commit();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: BogoSortHooks = {
    onShuffle: (att) => {
      snapshot({
        zh: `第 ${att} 次随机洗牌：${a.join(', ')}`,
        en: `Shuffle #${att}: ${a.join(', ')}`,
      });
    },
    onCheck: (ok) => {
      if (ok) {
        snapshot({ zh: '已有序！', en: 'Sorted!' }, 'final');
      }
    },
  };

  bogoSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
