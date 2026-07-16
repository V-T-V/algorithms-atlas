// 耐心排序变种 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { patienceSort2, type Patience2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 7, 1, 5, 3, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `输入：${input.join(', ')}`, en: `Input: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '策略', value: '发牌成堆 + k 路归并', role: 'pivot' }])
    .commit();

  const piles: number[][] = [];
  const hooks: Patience2Hooks = {
    onNewPile: (value, idx) => {
      piles[idx] = [value];
      rec
        .begin({
          zh: `值 ${value} 无可放堆，新建堆 ${idx}`,
          en: `Value ${value}: no suitable pile, create pile ${idx}`,
        })
        .setBars(rec.barsFrom(input))
        .setAux([{ label: `堆 ${idx}`, value: JSON.stringify(piles[idx]), role: 'frontier' }])
        .commit();
    },
    onPile: (value, idx) => {
      piles[idx] = [...(piles[idx] ?? []), value];
      rec
        .begin({ zh: `值 ${value} 压入堆 ${idx}`, en: `Value ${value} placed on pile ${idx}` })
        .setBars(rec.barsFrom(input))
        .setAux([{ label: `堆 ${idx}`, value: JSON.stringify(piles[idx]), role: 'swap' }])
        .commit();
    },
    onMergeStart: (count) => {
      rec
        .begin({ zh: `共 ${count} 个堆，开始 k 路归并`, en: `${count} piles, begin k-way merge` })
        .setAux([{ label: '堆数', value: String(count), role: 'pivot' }])
        .commit();
    },
  };

  const result = patienceSort2(input, hooks);

  rec
    .begin({ zh: `排序完成：${result.join(', ')}`, en: `Sorted: ${result.join(', ')}` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
