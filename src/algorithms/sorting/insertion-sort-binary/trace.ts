// =============================================================================
// 二分插入排序 · 录制帧序列
// 通过 binaryInsertionSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryInsertionSort, type BinaryInsertionHooks } from './impl.ts';

export const DEFAULT_INPUT = [8, 3, 5, 1, 9, 2, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let sortedHi = 0; // 已排序段右端（不含）
  let probeMid = -1;
  let probeLo = -1;
  let probeHi = -1;
  let insertPos = -1;
  let insertI = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k < sortedHi; k++) roles[k] = 'sorted';
    if (probeMid >= 0) roles[probeMid] = 'compare';
    if (probeLo >= 0 && probeHi >= 0) {
      // 标记搜索区间边界
      if (probeLo < a.length) roles[probeLo] = roles[probeLo] ?? 'frontier';
      if (probeHi - 1 >= 0 && probeHi - 1 < a.length)
        roles[probeHi - 1] = roles[probeHi - 1] ?? 'frontier';
    }
    if (insertPos >= 0 && insertI >= 0) {
      roles[insertPos] = 'swap';
    }
    if (insertI >= 0 && !roles[insertI]) roles[insertI] = 'pivot';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    probeMid = -1;
    probeLo = -1;
    probeHi = -1;
    insertPos = -1;
    insertI = -1;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: BinaryInsertionHooks = {
    onElement: (i) => {
      sortedHi = i;
      snapshot({
        zh: `处理 a[${i}]=${a[i]}，在已排序段 [0, ${i}) 中二分定位`,
        en: `Process a[${i}]=${a[i]}; binary-search sorted prefix [0, ${i})`,
      });
    },
    onProbe: (lo, mid, hi) => {
      probeLo = lo;
      probeMid = mid;
      probeHi = hi;
      snapshot({
        zh: `探测 mid=${mid}（区间 [${lo}, ${hi})）`,
        en: `Probe mid=${mid} (range [${lo}, ${hi}))`,
      });
    },
    onInsertPos: (pos) => {
      insertPos = pos;
      snapshot({
        zh: `插入位置 = ${pos}`,
        en: `Insert position = ${pos}`,
      });
    },
    onInsert: (pos, i) => {
      // 同步显示用数组：复刻 impl 的搬移（数组已是搬移后状态）
      insertPos = pos;
      insertI = i;
      snapshot({
        zh: `右移 [${pos}, ${i}) 并写入 ${a[pos]} 到下标 ${pos}`,
        en: `Shift [${pos}, ${i}) right, place ${a[pos]} at index ${pos}`,
      });
      sortedHi = i + 1;
    },
  };

  binaryInsertionSort(input, hooks);
  sortedHi = a.length;

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
