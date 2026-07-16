// 标准库风格排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stdlibSort, type StdlibSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 11, 10];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '策略', value: '插入 + 快排 + 堆排兜底', role: 'pivot' }])
    .commit();

  const strategyCount = { insertion: 0, partition: 0, heapsort: 0 };

  const hooks: StdlibSortHooks = {
    onStrategy: (lo, hi, kind) => {
      strategyCount[kind]++;
      const roles: Record<number, BarRole> = {};
      for (let i = lo; i <= hi; i++) roles[i] = kind === 'partition' ? 'frontier' : 'swap';
      rec
        .begin({
          zh: `[${lo}..${hi}] 采用 ${kind === 'insertion' ? '插入排序' : kind === 'partition' ? '快速排序' : '堆排序'}`,
          en: `[${lo}..${hi}] uses ${kind}`,
        })
        .setBars(rec.barsFrom(a, roles))
        .setAux([{ label: '当前策略', value: kind, role: 'frontier' }])
        .commit();
    },
    onPartition: (lo, hi, pivotIdx, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = { [pivotIdx]: 'pivot' };
      rec
        .begin({
          zh: `分区 [${lo}..${hi}]，枢轴位置 ${pivotIdx}`,
          en: `Partition [${lo}..${hi}], pivot at ${pivotIdx}`,
        })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = stdlibSort(input, hooks);

  rec
    .begin({
      zh: `排序完成（插入 ${strategyCount.insertion} / 快排 ${strategyCount.partition} / 堆排 ${strategyCount.heapsort}）`,
      en: `Sorted (insertion ${strategyCount.insertion} / partition ${strategyCount.partition} / heapsort ${strategyCount.heapsort})`,
    })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
