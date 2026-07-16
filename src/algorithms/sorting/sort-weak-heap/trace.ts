// 三叉堆排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weakHeapSort, type WeakHeapSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '结构', value: '3-叉完全堆（d=3）', role: 'pivot' }])
    .commit();

  let pops = 0;
  const hooks: WeakHeapSortHooks = {
    onBuildMax: (root, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = { [root]: 'pivot' };
      rec
        .begin({ zh: `建堆：下沉节点 ${root}`, en: `Build: sift down node ${root}` })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
    onPopMax: (k, arr) => {
      a.splice(0, a.length, ...arr);
      pops++;
      const roles: Record<number, BarRole> = {};
      for (let i = a.length - pops; i < a.length; i++) roles[i] = 'sorted';
      rec
        .begin({ zh: `取出堆顶最大值放入位置 ${k}`, en: `Pop heap max to position ${k}` })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = weakHeapSort(input, hooks);

  rec
    .begin({ zh: `排序完成`, en: `Sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
