// =============================================================================
// 自然归并排序 · 录制帧序列
// 通过 naturalMergeSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { naturalMergeSort, type NaturalMergeHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 2, 4, 8, 6, 7, 0];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  // 用角色标记当前 run 边界（不同段交替 frontier/compare 以便区分）
  const runColors: BarRole[] = ['frontier', 'compare'];

  const snapshotWithRuns = (
    note: { zh: string; en: string },
    runs: Array<[number, number]>,
    mergeRange: [number, number] | null,
  ): void => {
    const roles: BarRole[] = a.map(() => 'default');
    runs.forEach((r, ri) => {
      for (let k = r[0]; k < r[1]; k++) roles[k] = runColors[ri % 2]!;
    });
    if (mergeRange) {
      for (let k = mergeRange[0]; k < mergeRange[1]; k++) roles[k] = 'swap';
    }
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
  };

  // 初始帧
  snapshotWithRuns(
    { zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` },
    [],
    null,
  );

  const hooks: NaturalMergeHooks = {
    onRun: (_lo, _hi) => {
      // 单独标记一个 run（用 aux 展示）
    },
    onRound: (round, runCount) => {
      snapshotWithRuns(
        {
          zh: `第 ${round + 1} 轮：当前 ${runCount} 个有序段，两两归并`,
          en: `Round ${round + 1}: ${runCount} runs, merge pairwise`,
        },
        [],
        null,
      );
    },
    onMerge: (lo, mid, hi) => {
      // 同步 a：impl 已归并，这里数组已是归并后状态
      snapshotWithRuns(
        {
          zh: `归并 [${lo}, ${mid}) 与 [${mid}, ${hi}) → [${lo}, ${hi})`,
          en: `Merge [${lo}, ${mid}) and [${mid}, ${hi}) → [${lo}, ${hi})`,
        },
        [],
        [lo, hi],
      );
    },
  };

  naturalMergeSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
