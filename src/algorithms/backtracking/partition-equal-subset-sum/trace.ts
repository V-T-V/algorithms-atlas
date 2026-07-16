// =============================================================================
// 等分割子集和 · 录制帧序列
// 可视化：setBars 渲染当前 chosen 子集；setAux 展示 target/currentSum/状态。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionEqualSubsetSum, type PartitionEqualSubsetSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 5, 11, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const total = input.reduce((a, b) => a + b, 0);
  const target = total % 2 === 0 ? total / 2 : -1;
  const chosen: number[] = [];

  rec
    .begin({
      zh: `总和=${total}，目标=${target}（总和一半）`,
      en: `Sum=${total}, target=${target} (half of sum)`,
    })
    .setBars([])
    .setAux([
      { label: '总和 total', value: String(total), role: 'default' },
      { label: '目标 target', value: String(target), role: 'pivot' },
      { label: '可分？', value: target < 0 ? '否（奇数）' : '搜索中', role: 'warn' },
    ])
    .commit();

  if (target < 0) {
    rec
      .begin({ zh: `总和为奇数，无法等分`, en: `Sum is odd, cannot partition` })
      .setBars([])
      .setAux([{ label: '结论', value: 'false', role: 'warn' }])
      .commit();
    return rec.build();
  }

  const render = (note: { zh: string; en: string }, currentSum: number, final: boolean): void => {
    rec
      .begin(note)
      .setBars(chosen.map((v) => ({ value: v, role: (final ? 'final' : 'pivot') as BarRole })))
      .setAux([
        { label: 'chosen', value: chosen.join(' + ') || '∅', role: 'pivot' },
        { label: 'currentSum', value: String(currentSum), role: 'compare' },
        { label: 'target', value: String(target), role: 'pivot' },
        { label: '差额', value: String(target - currentSum), role: 'default' },
      ])
      .commit();
  };

  const hooks: PartitionEqualSubsetSumHooks = {
    onInclude: (_i, v, cur, _tgt) => {
      chosen.push(v);
      render({ zh: `纳入 ${v}，currentSum=${cur}`, en: `Include ${v}, sum=${cur}` }, cur, false);
    },
    onExclude: (_i, v, cur, _tgt) => {
      render({ zh: `跳过 ${v}，currentSum=${cur}`, en: `Exclude ${v}, sum=${cur}` }, cur, false);
    },
    onMemoHit: () => {
      void 0;
    },
    onSolution: () => {
      render(
        { zh: `找到等分子集！currentSum=${target}`, en: `Found partition! sum=${target}` },
        target,
        true,
      );
    },
  };

  const result = partitionEqualSubsetSum(input, hooks);

  rec
    .begin({
      zh: result.canPartition ? `可等分：${result.subset.join(' + ')} = ${target}` : `不可等分`,
      en: result.canPartition
        ? `Partitionable: ${result.subset.join(' + ')} = ${target}`
        : `Not partitionable`,
    })
    .setBars(
      result.canPartition
        ? result.subset.map((v) => ({ value: v, role: 'final' as BarRole }))
        : input.map((v) => ({ value: v, role: 'warn' as BarRole })),
    )
    .setAux([
      {
        label: '结论',
        value: result.canPartition ? 'true' : 'false',
        role: result.canPartition ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
