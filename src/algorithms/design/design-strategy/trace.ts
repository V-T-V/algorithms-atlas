import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  BubbleSort,
  SelectionSort,
  InsertionSort,
  SortContext,
  type StrategyHooks,
} from './impl.ts';

interface TraceInput {
  data: number[];
  strategies: string[];
}
export const DEFAULT_INPUT: TraceInput = {
  data: [3, 1, 4, 1, 5],
  strategies: ['bubble', 'selection', 'insertion'],
};

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks: StrategyHooks = {
    onCompare: (i: number, j: number) =>
      rec
        .begin({ zh: `比较 a[${i}] 与 a[${j}]`, en: `Compare a[${i}] vs a[${j}]` })
        .setAux([{ label: '比较', value: `${i}↔${j}`, role: 'compare' as BarRole }])
        .commit(),
    onSwap: (i: number, j: number, arr: number[]) =>
      rec
        .begin({
          zh: `交换 a[${i}] ↔ a[${j}] → [${arr.join(',')}]`,
          en: `Swap a[${i}] ↔ a[${j}] → [${arr.join(',')}]`,
        })
        .setAux([{ label: '当前', value: arr.join(','), role: 'frontier' as BarRole }])
        .commit(),
    onStrategyChange: (name: string) =>
      rec
        .begin({ zh: `切换到 ${name} 策略`, en: `Switch to ${name} strategy` })
        .setAux([{ label: '策略', value: name, role: 'pivot' as BarRole }])
        .commit(),
    onResult: (sorted, comparisons, swaps) =>
      rec
        .begin({
          zh: `${swaps > 0 ? '完成' : ''}排序=[${sorted.join(',')}], 比较 ${comparisons}, 交换 ${swaps}`,
          en: `Sorted=[${sorted.join(',')}], ${comparisons} compares, ${swaps} swaps`,
        })
        .setAux([
          { label: '结果', value: sorted.join(','), role: 'final' as BarRole },
          { label: '比较', value: String(comparisons), role: 'compare' as BarRole },
          { label: '交换', value: String(swaps), role: 'sorted' as BarRole },
        ])
        .commit(),
  };
  const map: Record<string, () => BubbleSort | SelectionSort | InsertionSort> = {
    bubble: () => new BubbleSort(),
    selection: () => new SelectionSort(),
    insertion: () => new InsertionSort(),
  };
  rec
    .begin({ zh: `输入 [${input.data.join(',')}]`, en: `Input [${input.data.join(',')}]` })
    .setAux([{ label: '长度', value: String(input.data.length), role: 'default' as BarRole }])
    .commit();
  let ctx: SortContext | null = null;
  for (const s of input.strategies) {
    const mk = map[s];
    if (!mk) continue;
    if (ctx === null) ctx = new SortContext(mk(), hooks);
    else ctx.setStrategy(mk());
    ctx.sort(input.data);
  }
  return rec.build();
}
