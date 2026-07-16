// 洗牌防御排序 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shuffleThenSort, type ShuffleThenSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 8, 7, 6, 5, 4, 3, 2, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  rec
    .begin({
      zh: `初始数组（可能已有序/逆序）：${a.join(', ')}`,
      en: `Initial array: ${a.join(', ')}`,
    })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '风险', value: '有序输入触发 O(n²) 最坏', role: 'warn' }])
    .commit();

  // 使用可复现的伪随机源
  let seed = 12345;
  const rng = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const hooks: ShuffleThenSortHooks = {
    onShuffleEnd: (shuffled) => {
      a.splice(0, a.length, ...shuffled);
      rec
        .begin({
          zh: `Fisher-Yates 洗牌后：${a.join(', ')}`,
          en: `After Fisher-Yates shuffle: ${a.join(', ')}`,
        })
        .setBars(rec.barsFrom(a))
        .setAux([{ label: '状态', value: '已打乱，最坏情况被消除', role: 'pivot' }])
        .commit();
    },
    onSwap: (i, j, arr) => {
      a.splice(0, a.length, ...arr);
      const roles: Record<number, BarRole> = { [i]: 'swap', [j]: 'swap' };
      rec
        .begin({ zh: `快排交换 a[${i}]↔a[${j}]`, en: `Quicksort swap a[${i}]↔a[${j}]` })
        .setBars(rec.barsFrom(a, roles))
        .commit();
    },
  };

  const result = shuffleThenSort(input, rng, hooks);

  rec
    .begin({ zh: `排序完成`, en: `Sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
