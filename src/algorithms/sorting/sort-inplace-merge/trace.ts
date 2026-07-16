// 原地归并排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { inplaceMergeSort, type InplaceMergeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '策略', value: '手摇反转原地合并', role: 'pivot' }])
    .commit();

  const hooks: InplaceMergeSortHooks = {
    onMerge: (lo, mid, hi, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = {};
      for (let i = lo; i <= hi; i++) roles[i] = 'sorted';
      rec
        .begin({
          zh: `合并 [${lo}..${mid}] 与 [${mid + 1}..${hi}]`,
          en: `Merge [${lo}..${mid}] and [${mid + 1}..${hi}]`,
        })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
    onRotate: (lo, mid, hi, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = {};
      for (let i = lo; i < hi; i++) roles[i] = 'swap';
      rec
        .begin({
          zh: `旋转 [${lo}..${mid - 1}] 与 [${mid}..${hi - 1}]`,
          en: `Rotate [${lo}..${mid - 1}] with [${mid}..${hi - 1}]`,
        })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = inplaceMergeSort(input, hooks);

  rec
    .begin({ zh: `排序完成`, en: `Sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
