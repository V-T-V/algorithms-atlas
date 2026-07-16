// 二分插入排序变种 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryInsertionSort2, type BinaryInsertion2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 2, 9, 3, 7, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '策略', value: 'bisectRight 二分定位（稳定）', role: 'pivot' }])
    .commit();

  const hooks: BinaryInsertion2Hooks = {
    onInsertPos: (i, pos) => {
      const roles: Record<number, BarRole> = {};
      for (let k = 0; k < i; k++) roles[k] = 'sorted';
      roles[i] = 'pivot';
      roles[pos] = 'compare';
      rec
        .begin({
          zh: `a[${i}]=${a[i]}，二分定位到位置 ${pos}`,
          en: `a[${i}]=${a[i]}, binary search locates position ${pos}`,
        })
        .setBars(rec.barsFrom(a, roles))
        .setAux([{ label: '插入位置', value: String(pos), role: 'frontier' }])
        .commit();
    },
  };

  const result = binaryInsertionSort2(input, hooks);

  rec
    .begin({ zh: `排序完成`, en: `Sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
