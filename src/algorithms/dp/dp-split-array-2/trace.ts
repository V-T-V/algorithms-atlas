// =============================================================================
// 分割数组最大和 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitArray, type SplitArrayHooks } from './impl.ts';

export const DEFAULT_INPUT = { nums: [7, 2, 5, 10, 8], m: 2 };

export function buildTrace(input: { nums: number[]; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([{ label: '二分探查', value: note.zh, role: 'frontier' }])
      .commit();
  };

  snap({
    zh: `nums=[${input.nums.join(',')}] m=${input.m}`,
    en: `nums=[${input.nums.join(',')}] m=${input.m}`,
  });

  const hooks: SplitArrayHooks = {
    onProbe: (limit, ok, g) => {
      snap({
        zh: `limit=${limit} → ${ok ? `可行(${g}段)` : `不可行(${g}段>m)`}`,
        en: `limit=${limit}: ${ok ? `feasible (${g} groups)` : `infeasible (${g}>m)`}`,
      });
    },
  };

  const ans = splitArray(input.nums, input.m, hooks);

  rec
    .begin({ zh: `最小最大段和=${ans}`, en: `Largest sum=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
