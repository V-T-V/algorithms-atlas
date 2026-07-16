// 摆动子序列 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wiggleSubseq, type WiggleSubseqHooks } from './impl.ts';

export interface WsInput {
  nums: number[];
}

export const DEFAULT_INPUT: WsInput = { nums: [1, 7, 4, 9, 2, 5] };

/** 录制演示帧序列。 */
export function buildTrace(input: WsInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { nums } = input;
  const dirs = new Array<'up' | 'down' | undefined>(nums.length).fill(undefined);

  rec
    .begin({ zh: `数列 [${nums.join(',')}]`, en: `Sequence [${nums.join(',')}]` })
    .setArray(
      nums,
      nums.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: WiggleSubseqHooks = {
    onDirection: (i, dir) => {
      dirs[i] = dir;
      rec
        .begin({ zh: `${i}：方向 ${dir}`, en: `${i}: direction ${dir}` })
        .setArray(
          nums,
          nums.map(
            (_, j) => (j === i ? (dir === 'up' ? 'compare' : 'swap') : 'default') as BarRole,
          ),
          [{ index: i, label: 'i' }],
        )
        .commit();
    },
  };
  const { length } = wiggleSubseq(nums, hooks);

  rec
    .begin({ zh: `完成：最长摆动长度 ${length}`, en: `Done: length ${length}` })
    .setArray(
      nums,
      nums.map(() => 'final' as BarRole),
      [],
    )
    .setMap([{ key: '长度', value: String(length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
