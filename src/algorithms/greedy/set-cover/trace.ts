// 集合覆盖 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { setCover, type SetCoverHooks } from './impl.ts';

export interface ScInput {
  subsets: number[][];
  universe: number[];
}

export const DEFAULT_INPUT: ScInput = {
  subsets: [
    [1, 2, 3],
    [2, 4],
    [3, 5],
    [4, 5, 6],
    [1, 6],
  ],
  universe: [1, 2, 3, 4, 5, 6],
};

/** 录制演示帧序列。 */
export function buildTrace(input: ScInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { subsets, universe } = input;

  rec
    .begin({
      zh: `${subsets.length} 个子集，覆盖 ${universe.length} 个元素`,
      en: `${subsets.length} subsets, ${universe.length} elements`,
    })
    .setBars(universe.map((e) => ({ value: e, role: 'default' as BarRole })))
    .commit();

  const hooks: SetCoverHooks = {
    onPick: (idx, gain) => {
      rec
        .begin({ zh: `选子集 ${idx}（新增 ${gain} 个）`, en: `Pick subset ${idx} (+${gain})` })
        .setBars(
          subsets.map((s, i) => ({
            value: s.length,
            role: (i === idx ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };
  const { chosen } = setCover(subsets, universe, hooks);

  rec
    .begin({
      zh: `完成：选中 ${chosen.length} 个子集`,
      en: `Done: ${chosen.length} subsets chosen`,
    })
    .setMap(
      chosen.map((idx, i) => ({
        key: `选择 ${i + 1}`,
        value: `子集 ${idx}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
