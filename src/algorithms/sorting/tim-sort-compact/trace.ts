// =============================================================================
// 紧凑 Tim 排序 · 录制帧序列
// 通过 compactTimSort 的钩子，把执行过程录成 Frame[]。
// 为使可视化与 impl 一致，本 trace 在本地镜像翻转/归并操作以维护数组状态。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { compactTimSort, type CompactTimHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 1, 9, 3, 7, 2, 8, 4, 6, 0, 11, 13, 10, 12, 15, 14, 17, 16];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const sortedRanges: Array<{ lo: number; hi: number }> = [];

  const snapshot = (
    note: { zh: string; en: string },
    highlight?: { lo: number; hi: number; role: BarRole },
  ): void => {
    const roles: Record<number, BarRole> = {};
    for (const r of sortedRanges) for (let k = r.lo; k <= r.hi; k++) roles[k] = 'sorted';
    if (highlight) for (let k = highlight.lo; k <= highlight.hi; k++) roles[k] = highlight.role;
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: CompactTimHooks = {
    onFlip: (lo, hi) => {
      // 本地镜像翻转
      let l = lo;
      let r = hi;
      while (l < r) {
        const t = a[l]!;
        a[l] = a[r]!;
        a[r] = t;
        l++;
        r--;
      }
      snapshot(
        { zh: `降序段 [${lo},${hi}] 翻转为升序`, en: `Flip descending run [${lo},${hi}]` },
        { lo, hi, role: 'swap' },
      );
    },
    onInsertion: (lo, hi) => {
      // 本地镜像插入排序补齐
      for (let i = lo + 1; i <= hi; i++) {
        const key = a[i]!;
        let j = i - 1;
        while (j >= lo && a[j]! > key) {
          a[j + 1] = a[j]!;
          j--;
        }
        a[j + 1] = key;
      }
      snapshot(
        { zh: `小段 [${lo},${hi}] 插入排序补齐`, en: `Insertion extend [${lo},${hi}]` },
        { lo, hi, role: 'compare' },
      );
    },
    onRun: (lo, hi) => {
      sortedRanges.push({ lo, hi });
      snapshot({ zh: `识别 run [${lo},${hi}]`, en: `Run [${lo},${hi}]` });
    },
    onMerge: (lo, mid, hi) => {
      // 本地镜像稳定归并
      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        if (left[i]! <= right[j]!) {
          a[k] = left[i]!;
          i++;
        } else {
          a[k] = right[j]!;
          j++;
        }
        k++;
      }
      while (i < left.length) {
        a[k] = left[i]!;
        i++;
        k++;
      }
      while (j < right.length) {
        a[k] = right[j]!;
        j++;
        k++;
      }
      snapshot(
        {
          zh: `合并 [${lo},${mid}] ∪ [${mid + 1},${hi}]`,
          en: `Merge [${lo},${mid}] ∪ [${mid + 1},${hi}]`,
        },
        { lo, hi, role: 'frontier' },
      );
    },
  };

  compactTimSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
