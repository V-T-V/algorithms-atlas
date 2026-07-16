// =============================================================================
// 子集 II · 录制帧序列
// 可视化：setBars 渲染当前 chosen 子集；setAux 展示排序后数组和去重剪枝。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsets2, type Subsets2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  const chosen: number[] = [];
  let count = 0;

  const render = (
    note: { zh: string; en: string },
    final: boolean,
    prunedIdx: number | null,
  ): void => {
    const bars = chosen.map((v) => ({ value: v, role: (final ? 'final' : 'pivot') as BarRole }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'chosen', value: chosen.length ? chosen.join(', ') : '∅', role: 'pivot' },
      { label: '已收集', value: String(count), role: 'default' },
      {
        label: '排序后数组',
        value: `[${sorted.join(', ')}]`,
        role: prunedIdx !== null ? 'warn' : 'default',
      },
    ];
    if (prunedIdx !== null) {
      aux.push({
        label: `剪枝 a[${prunedIdx}]=${sorted[prunedIdx]}`,
        value: '同层重复，跳过',
        role: 'warn',
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  rec
    .begin({
      zh: `排序后数组 [${sorted.join(', ')}]，枚举不重复子集`,
      en: `Sorted [${sorted.join(', ')}], enumerate distinct subsets`,
    })
    .setBars([])
    .setAux([{ label: 'chosen', value: '∅', role: 'default' }])
    .commit();

  const hooks: Subsets2Hooks = {
    onPick: (_i, _v, c) => {
      chosen.length = 0;
      chosen.push(...c);
      render({ zh: `选取元素`, en: `Pick element` }, false, null);
    },
    onPrune: (i, _v) => {
      render(
        {
          zh: `同层重复 a[${i}]=${sorted[i]}，剪枝跳过`,
          en: `Same-level duplicate a[${i}]=${sorted[i]}, prune`,
        },
        false,
        i,
      );
    },
    onBacktrack: (_i, _v, c) => {
      chosen.length = 0;
      chosen.push(...c);
      render({ zh: `回溯`, en: `Backtrack` }, false, null);
    },
    onSubset: (subset) => {
      count++;
      chosen.length = 0;
      chosen.push(...subset);
      render(
        {
          zh: `得到子集 #${count}：{ ${subset.join(', ')} }`,
          en: `Subset #${count}: { ${subset.join(', ')} }`,
        },
        true,
        null,
      );
    },
  };

  const result = subsets2(input, hooks);

  rec
    .begin({
      zh: `完成：共 ${result.length} 个不重复子集`,
      en: `Done: ${result.length} distinct subsets`,
    })
    .setBars(sorted.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '不重复子集总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
