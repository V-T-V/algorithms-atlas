// =============================================================================
// 合并果子 · 录制帧序列
// 通过 huffmanTask 的钩子，把贪心执行过程录成 Frame[]。
// 可视化：setBars 渲染当前各堆（升序），setAux 展示每次合并的两小堆 + 结果 + 累计代价。
// roles: 本次合并的两堆='swap'，合并结果='pivot'，已合并标记。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { huffmanTask, type HuffmanTaskHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  // 当前展示的堆（升序）+ 本次合并高亮的两堆下标
  let currentPiles: number[] = [...input].sort((x, y) => x - y);
  let mergePair: [number, number] | null = null;
  let mergeResult: number | null = null;
  let totalCost = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = currentPiles.map((v, i) => {
      const role: BarRole =
        mergePair && (mergePair[0] === i || mergePair[1] === i)
          ? 'swap'
          : mergeResult !== null && i === currentPiles.length - 1
            ? 'pivot'
            : 'default';
      return { value: v, role, label: String(v) };
    });
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '剩余堆数', value: String(currentPiles.length), role: 'default' as BarRole },
        { label: '累计代价', value: String(totalCost), role: 'final' as BarRole },
        ...(mergePair && mergeResult !== null
          ? [
              {
                label: '本次合并',
                value: `${currentPiles[mergePair[0]] ?? '?'} + ${currentPiles[mergePair[1]] ?? '?'} = ${mergeResult}`,
                role: 'pivot' as BarRole,
              },
            ]
          : []),
      ])
      .commit();
    mergePair = null;
    mergeResult = null;
  };

  // 初始
  currentPiles = [...input].sort((x, y) => x - y);
  rec
    .begin({
      zh: `${n} 堆果子：[${input.join(', ')}]（目标：合并成一堆，最小化总代价）`,
      en: `${n} piles: [${input.join(', ')}] (goal: merge into one, minimize total cost)`,
    })
    .setBars(currentPiles.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([
      { label: '剩余堆数', value: String(n), role: 'default' },
      { label: '累计代价', value: '0', role: 'final' },
    ])
    .commit();

  const hooks: HuffmanTaskHooks = {
    onPickMin: (piles) => {
      currentPiles = [...piles];
      // 标记最小的两堆（piles 已升序，下标 0、1）
      mergePair = piles.length >= 2 ? [0, 1] : null;
      snapshot({
        zh: `取出最小的两堆 ${piles[0]} 和 ${piles[1]}`,
        en: `Pick the two smallest piles ${piles[0]} and ${piles[1]}`,
      });
    },
    onMerge: (a, b, c, piles) => {
      totalCost += c;
      currentPiles = [...piles];
      // 合并后 piles 末尾是新堆（snapshot 已升序，新堆未必在末尾，这里直接用值标注）
      const idx = piles.indexOf(c);
      mergeResult = c;
      mergePair = idx >= 0 ? [idx, idx] : null;
      snapshot({
        zh: `合并 ${a} + ${b} = ${c}（代价 +${c}，累计 ${totalCost}）`,
        en: `Merge ${a} + ${b} = ${c} (cost +${c}, total ${totalCost})`,
      });
    },
  };

  const result = huffmanTask(input, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：最小总代价 = ${result.totalCost}`,
      en: `Done: minimum total cost = ${result.totalCost}`,
    })
    .setBars([
      { value: result.totalCost, role: 'final' as BarRole, label: `总代价 ${result.totalCost}` },
    ])
    .setAux([
      { label: '最小总代价', value: String(result.totalCost), role: 'final' as BarRole },
      {
        label: '合并序列',
        value: result.merges.map(([a, b, c]) => `${a}+${b}=${c}`).join(', '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
