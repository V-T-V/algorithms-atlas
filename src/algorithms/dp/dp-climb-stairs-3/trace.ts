// =============================================================================
// 爬楼梯（变步长）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { climbStairsVar, type ClimbStairsVarHooks } from './impl.ts';

export const DEFAULT_N = 5;
export const DEFAULT_STEPS = [1, 2, 3];

export function buildTrace(
  n: number = DEFAULT_N,
  steps: readonly number[] = DEFAULT_STEPS,
): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, i) =>
      i === cur ? 'pivot' : i === n ? 'final' : dp[i]! > 0 ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setArray([...dp], roles, [{ index: cur < 0 ? 0 : cur, label: 'i' }])
      .setAux([
        { label: 'steps', value: `[${steps.join(',')}]`, role: 'frontier' },
        { label: 'dp', value: dp.map((v) => `${v}`).join(' '), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `n=${n} steps=[${steps.join(',')}]`, en: `n=${n} steps=[${steps.join(',')}]` });

  const hooks: ClimbStairsVarHooks = {
    onUpdate: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` });
    },
    onDone: (w) => {
      ans = w;
      cur = -1;
      snap({ zh: `方案数=${w}`, en: `ways=${w}` });
    },
  };

  climbStairsVar(n, steps, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(steps.map((s) => ({ value: s, role: 'final' as BarRole })))
    .setAux([{ label: '方案数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
