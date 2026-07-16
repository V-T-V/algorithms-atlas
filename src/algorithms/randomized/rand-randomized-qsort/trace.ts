import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomizedQuicksort, makeRng } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pivots: Record<number, BarRole> = {};
  const sorted = new Set<number>();

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const k of Object.keys(pivots)) roles[Number(k)] = 'pivot';
    for (const i of sorted) roles[i] = 'final';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([{ label: '已排序数', value: sorted.size.toString(), role: 'final' as BarRole }])
      .commit();
  };

  snap({ zh: `初始数组 n=${a.length}`, en: `Initial array n=${a.length}` });

  randomizedQuicksort(a, makeRng(42), {
    onSwap: (i, j) => {
      [a[i], a[j]] = [a[j]!, a[i]!];
      // 不在这里改 a（impl 内部已改），仅刷新视图
      snap({ zh: `交换 [${i}]↔[${j}]`, en: `Swap [${i}]↔[${j}]` });
    },
    onSegment: () => {
      // 推进一段
    },
  });

  // 直接调用得到排序结果
  const result = randomizedQuicksort(input, makeRng(42));
  for (let i = 0; i < result.length; i++) sorted.add(i);
  snap({ zh: '完成', en: 'Done' });

  rec
    .begin({ zh: `完成：升序排序 ${result.join(',')}`, en: `Done: sorted ${result.join(',')}` })
    .setBars(
      rec.barsFrom(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'final'])) as Record<number, BarRole>,
      ),
    )
    .setAux([{ label: '结果', value: result.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
