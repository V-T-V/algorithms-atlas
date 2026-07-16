// =============================================================================
// 分割数组的最大值 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitArrayLargest, type SplitArrayHooks } from './impl.ts';

export const DEFAULT_NUMS = [7, 2, 5, 10, 8];
export const DEFAULT_M = 2;

export function buildTrace(nums: readonly number[] = DEFAULT_NUMS, m: number = DEFAULT_M): Frame[] {
  const rec = new TraceRecorder();
  let ans = 0;

  rec
    .begin({ zh: `nums=[${nums.join(',')}] m=${m}`, en: `nums=[${nums.join(',')}] m=${m}` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([
      { label: 'nums', value: `[${nums.join(',')}]`, role: 'frontier' },
      { label: 'm', value: String(m), role: 'pivot' },
    ])
    .commit();

  const hooks: SplitArrayHooks = {
    onCheck: (limit, segs, feasible) => {
      rec
        .begin({
          zh: `尝试 limit=${limit} 需 ${segs} 段 ${feasible ? '可行' : '不可行'}`,
          en: `limit=${limit} needs ${segs} segs, ${feasible ? 'feasible' : 'infeasible'}`,
        })
        .setBars(nums.map((v) => ({ value: v, role: (feasible ? 'frontier' : 'warn') as BarRole })))
        .setAux([
          { label: 'limit', value: String(limit), role: 'compare' },
          { label: '段数', value: String(segs), role: 'pivot' },
          { label: '可行', value: feasible ? '是' : '否', role: feasible ? 'final' : 'warn' },
        ])
        .commit();
    },
    onDone: (b) => {
      ans = b;
    },
  };

  splitArrayLargest(nums, m, hooks);

  rec
    .begin({ zh: `最小最大段和=${ans}`, en: `min largest sum=${ans}` })
    .setBars(nums.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '结果', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
