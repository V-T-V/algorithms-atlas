// =============================================================================
// MSD 基数排序 · 录制帧序列
// 通过 msdRadixSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { msdRadixSort, type MsdRadixHooks } from './impl.ts';

export const DEFAULT_INPUT = [329, 457, 657, 839, 436, 720, 355];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  let curDigit = -1;
  let curLo = -1;
  let curHi = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = a.map(() => 'default');
    if (curLo >= 0 && curHi >= 0) {
      for (let k = curLo; k < curHi; k++) roles[k] = 'frontier';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([
        { label: '当前位', value: curDigit >= 0 ? String(curDigit) : '-', role: 'pivot' },
        { label: '子段', value: curLo >= 0 ? `[${curLo}, ${curHi})` : '-' },
      ])
      .commit();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: MsdRadixHooks = {
    onEnterRange: (digit, lo, hi) => {
      curDigit = digit;
      curLo = lo;
      curHi = hi;
      snapshot({
        zh: `处理第 ${digit} 位（子段 [${lo}, ${hi})）`,
        en: `Process digit ${digit} (range [${lo}, ${hi}))`,
      });
    },
    onDistribute: () => {
      /* 单个分配不单独成帧，避免帧数过多 */
    },
    onCollect: (digit, lo, hi) => {
      // impl 已回写，a 已是分组后状态
      curDigit = digit;
      curLo = lo;
      curHi = hi;
      snapshot({
        zh: `按第 ${digit} 位分桶后回写 [${lo}, ${hi})`,
        en: `Collected after bucketing on digit ${digit} → [${lo}, ${hi})`,
      });
    },
    onDone: () => {
      /* 子段完成 */
    },
  };

  msdRadixSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
