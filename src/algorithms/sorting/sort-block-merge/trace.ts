// 块归并排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blockMergeSort, type BlockMergeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '策略', value: '块大小 ≈ √n', role: 'pivot' }])
    .commit();

  const hooks: BlockMergeSortHooks = {
    onBlockSize: (size) => {
      rec
        .begin({ zh: `块大小 = ${size}`, en: `Block size = ${size}` })
        .setAux([{ label: '块大小', value: String(size), role: 'frontier' }])
        .commit();
    },
    onBlockSorted: (start, end, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = {};
      for (let i = start; i < end; i++) roles[i] = 'sorted';
      rec
        .begin({ zh: `块内排序 [${start}..${end})`, en: `Sort block [${start}..${end})` })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
    onBlocksMerged: (start, end, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = {};
      for (let i = start; i < end; i++) roles[i] = 'swap';
      rec
        .begin({ zh: `归并块 [${start}..${end})`, en: `Merge blocks [${start}..${end})` })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = blockMergeSort(input, hooks);

  rec
    .begin({ zh: `排序完成`, en: `Sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
