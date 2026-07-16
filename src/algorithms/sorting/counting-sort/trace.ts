// =============================================================================
// 计数排序 · 录制帧序列
// 通过 countingSort 的钩子，把执行过程录成 Frame[]。
// 非比较排序：步骤体现「计数 → 前缀和 → 分配收集」。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingSort, type CountingSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  // output 逐步被填充；未填充位置用 null 表示（渲染时用占位）
  const output: Array<number | null> = new Array(n).fill(null);
  const collected = new Set<number>(); // output 中已落位的下标
  const highlighting = new Set<number>(); // 输入中正在被处理的下标

  const snapshot = (note: { zh: string; en: string }, count?: number[]): void => {
    const roles: Record<number, BarRole> = {};
    for (const c of collected) roles[c] = 'final';
    for (const h of highlighting) if (roles[h] === undefined) roles[h] = 'compare';
    // 把 output 渲染为柱（未填充处用 0 + default）
    const bars = output.map((v, i) => ({
      value: v ?? 0,
      role: roles[i] ?? 'default',
      label: v === null ? '_' : String(v),
    }));
    const frame = rec.begin(note).setBars(bars);
    if (count) {
      frame.setAux(count.map((c, v) => ({ label: String(v), value: String(c), role: 'default' })));
    }
    frame.commit();
    highlighting.clear();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: CountingSortHooks = {
    onRange: (maxVal) => {
      snapshot({
        zh: `值域上界 max = ${maxVal}，建立大小为 ${maxVal + 1} 的计数表`,
        en: `Range max = ${maxVal}; allocate count table of size ${maxVal + 1}`,
      });
    },
    onTally: (i, _v) => {
      highlighting.add(i);
    },
    onPrefix: (count) => {
      snapshot(
        {
          zh: `计数累加为前缀和：count[v] = 「≤ v 的元素个数」`,
          en: `Prefix-sum the counts: count[v] = number of elements ≤ v`,
        },
        count,
      );
    },
    onCollect: (i, v, outIdx) => {
      output[outIdx] = v;
      collected.add(outIdx);
      highlighting.add(outIdx);
      snapshot({
        zh: `从输入下标 ${i}（值 ${v}）放入输出位置 ${outIdx}`,
        en: `Place input[${i}] = ${v} into output[${outIdx}]`,
      });
    },
  };

  countingSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(output.map((v) => ({ value: v ?? 0, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
