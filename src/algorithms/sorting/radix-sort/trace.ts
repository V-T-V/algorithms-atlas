// =============================================================================
// 基数排序 (LSD) · 录制帧序列
// 通过 radixSort 的钩子，把执行过程录成 Frame[]。
// 非比较排序：步骤体现「逐位 分配 → 收集」。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixSort, type RadixSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [170, 45, 75, 90, 802, 24, 2, 66];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 当前数组状态（每处理完一位后更新）
  let a: number[] = [...input];
  const highlighting = new Set<number>();

  const snapshot = (note: { zh: string; en: string }, count?: number[]): void => {
    const roles: Record<number, BarRole> = {};
    for (const h of highlighting) if (roles[h] === undefined) roles[h] = 'compare';
    const bars = a.map((v, i) => ({ value: v, role: roles[i] ?? 'default' }));
    const frame = rec.begin(note).setBars(bars);
    if (count) {
      frame.setAux(count.map((c, d) => ({ label: `桶${d}`, value: String(c), role: 'default' })));
    }
    frame.commit();
    highlighting.clear();
  };

  const digitNames = ['个位', '十位', '百位', '千位', '万位'];
  const digitNamesEn = ['ones', 'tens', 'hundreds', 'thousands', '10⁴'];
  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: RadixSortHooks = {
    onDigit: (digit) => {
      const nameZh = digitNames[digit] ?? `第 ${digit + 1} 位`;
      const nameEn = digitNamesEn[digit] ?? `digit ${digit + 1}`;
      snapshot({
        zh: `按${nameZh}排序（稳定）`,
        en: `Stable sort by ${nameEn}`,
      });
    },
    onDistribute: (i) => {
      highlighting.add(i);
    },
    onBucket: (count) => {
      snapshot(
        {
          zh: `按当前位分配到 10 个桶并做前缀和`,
          en: `Distribute into 10 buckets and prefix-sum`,
        },
        count,
      );
    },
    onCollect: (i, v, outIdx, output) => {
      // 用当前 output 更新可显示状态（这一位收集过程中的中间态）
      a = output.map((x) => x);
      highlighting.add(outIdx);
      snapshot({
        zh: `收集：值 ${v}（来自下标 ${i}）放到 ${outIdx}`,
        en: `Collect: value ${v} (from idx ${i}) → ${outIdx}`,
      });
      void i;
    },
  };

  radixSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
