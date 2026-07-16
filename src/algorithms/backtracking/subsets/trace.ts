// =============================================================================
// 子集枚举 · 录制帧序列
// 通过 subsets 的钩子把回溯过程录成 Frame[]。
// 可视化：setBars 渲染「当前 chosen 子集」；setAux 展示决策路径（选/不选）。
// 每个完整子集额外 commit 一帧（标 final）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsets, type SubsetsHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const chosen: number[] = [];
  const decisions: Array<{ idx: number; pick: boolean }> = []; // 决策路径
  let curIdx: number | null = null;
  let curPick: boolean | null = null;

  const render = (
    note: { zh: string; en: string },
    final: boolean,
    subset: number[] | null,
  ): void => {
    const bars = subset ?? chosen;
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: 'chosen',
        value: chosen.length ? chosen.join(', ') : '∅',
        role: 'pivot',
      },
      {
        label: '决策路径',
        value: input
          .map((_, idx) => {
            const d = decisions.find((x) => x.idx === idx);
            return `${idx}:${d ? (d.pick ? '选' : '×') : '?'}`;
          })
          .join('  '),
      },
    ];
    if (curIdx !== null && curPick !== null) {
      aux.push({
        label: `当前 a[${curIdx}]=${input[curIdx]}`,
        value: curPick ? '选入子集' : '不选',
        role: curPick ? 'compare' : 'default',
      });
    }
    rec
      .begin(note)
      .setBars(bars.map((v) => ({ value: v, role: (final ? 'final' : 'pivot') as BarRole })))
      .setAux(aux)
      .commit();
  };

  rec
    .begin({
      zh: `枚举 [${input.join(', ')}] 的所有子集`,
      en: `Enumerate subsets of [${input.join(', ')}]`,
    })
    .setBars([])
    .setAux([{ label: 'chosen', value: '∅', role: 'default' }])
    .commit();

  const hooks: SubsetsHooks = {
    onDecide: (index, include) => {
      curIdx = index;
      curPick = include;
      // 更新决策路径：移除同 idx 的旧记录后压入
      const exist = decisions.findIndex((d) => d.idx === index);
      if (exist >= 0) decisions.splice(exist, 1);
      decisions.push({ idx: index, pick: include });
      if (include) chosen.push(input[index]!);
      render(
        {
          zh: `元素 ${input[index]}（下标 ${index}）：${include ? '选入' : '不选'}`,
          en: `Element ${input[index]} (idx ${index}): ${include ? 'include' : 'exclude'}`,
        },
        false,
        null,
      );
    },
    onBacktrack: (index, include) => {
      if (include) chosen.pop();
      // 回退决策路径
      const exist = decisions.findIndex((d) => d.idx === index);
      if (exist >= 0) decisions.splice(exist, 1);
      curIdx = null;
      curPick = null;
      render(
        {
          zh: `回溯：撤销对 ${input[index]}（下标 ${index}）的${include ? '选取' : '不选'}决策`,
          en: `Backtrack: undo ${include ? 'include' : 'exclude'} of ${input[index]} (idx ${index})`,
        },
        false,
        null,
      );
    },
    onSubset: (subset) => {
      render(
        {
          zh: `得到子集：{ ${subset.join(', ')} }`,
          en: `Subset: { ${subset.join(', ')} }`,
        },
        true,
        subset,
      );
    },
  };

  subsets(input, hooks);

  // 终态：全集
  rec
    .begin({ zh: `完成：共 ${2 ** n} 个子集`, en: `Done: ${2 ** n} subsets` })
    .setBars(input.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '总数', value: String(2 ** n), role: 'final' }])
    .commit();

  return rec.build();
}
