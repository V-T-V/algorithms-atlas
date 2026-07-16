// =============================================================================
// 分治设计范式 · 录制帧序列
// 用 setBars 展示当前数组；用 setAux 展示当前分/合步骤与递归深度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeSortDc, type DivideConquerHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

interface TraceOptions {
  arr: number[];
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const arr = input.arr ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();
  let current: number[] = [...arr];
  let depth = 0;

  const render = (note: { zh: string; en: string }, hiRange?: [number, number]): void => {
    const roles: BarRole[] = current.map((_, i) => {
      if (hiRange && i >= hiRange[0] && i < hiRange[1]) return 'compare';
      return 'default';
    });
    rec
      .begin(note)
      .setBars(current.map((v, i) => ({ value: v, role: roles[i]!, label: String(v) })))
      .setAux([
        { label: '当前深度', value: String(depth), role: 'pivot' as BarRole },
        { label: '当前数组', value: `[${current.join(', ')}]`, role: 'compare' as BarRole },
      ])
      .commit();
  };

  render({ zh: `初始数组：[${arr.join(', ')}]`, en: `Initial array: [${arr.join(', ')}]` });

  const hooks: DivideConquerHooks = {
    onDivide: (lo, hi, d) => {
      depth = d;
      current = [...arr]; // 分阶段展示原数组的高亮区间
      // 用 arr 的副本展示，区间高亮
      const roles: BarRole[] = arr.map((_, i) => (i >= lo && i < hi ? 'compare' : 'default'));
      rec
        .begin({
          zh: `分：把 [${lo},${hi}) 分两半（深度 ${d}）`,
          en: `Divide: split [${lo},${hi}) into halves (depth ${d})`,
        })
        .setBars(arr.map((v, i) => ({ value: v, role: roles[i]!, label: String(v) })))
        .setAux([
          { label: '区间', value: `[${lo}, ${hi})`, role: 'swap' as BarRole },
          { label: '深度', value: String(d), role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onConquerBase: (lo, hi) => {
      rec
        .begin({
          zh: `治（基线）：[${lo},${hi}) 只剩 ${hi - lo} 个元素`,
          en: `Conquer (base): [${lo},${hi}) has ${hi - lo} element(s)`,
        })
        .setAux([{ label: '基线', value: `[${lo}, ${hi})`, role: 'final' as BarRole }])
        .commit();
    },
    onMerge: (lo, mid, hi, merged) => {
      current = [...arr];
      // 把合并结果写回展示
      const temp = [...arr];
      for (let i = 0; i < merged.length; i++) temp[lo + i] = merged[i]!;
      const roles: BarRole[] = temp.map((_, i) => (i >= lo && i < hi ? 'final' : 'default'));
      rec
        .begin({
          zh: `合：合并 [${lo},${mid}) 与 [${mid},${hi}) → [${merged.join(', ')}]`,
          en: `Combine: merge [${lo},${mid}) and [${mid},${hi}) → [${merged.join(', ')}]`,
        })
        .setBars(temp.map((v, i) => ({ value: v, role: roles[i]!, label: String(v) })))
        .setAux([{ label: '合并段', value: `[${merged.join(', ')}]`, role: 'final' as BarRole }])
        .commit();
      // 更新 arr 的本地副本以反映合并
      for (let i = 0; i < merged.length; i++) (arr as number[])[lo + i] = merged[i]!;
    },
  };

  const { sorted } = mergeSortDc(arr, hooks);

  rec
    .begin({ zh: `完成：已排序 [${sorted.join(', ')}]`, en: `Done: sorted [${sorted.join(', ')}]` })
    .setBars(sorted.map((v) => ({ value: v, role: 'sorted' as BarRole, label: String(v) })))
    .setAux([
      { label: '范式', value: '分 → 治 → 合', role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n log n)', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
