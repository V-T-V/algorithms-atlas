// =============================================================================
// 爬楼梯（带障碍）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { climbStairsObstacle, type ClimbStairsHooks } from './impl.ts';

export const DEFAULT_INPUT = [false, false, true, false, false, false];

export function buildTrace(blocked: readonly boolean[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = blocked.length;
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  let cur = -1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        dp.map((v, i) => ({
          value: v,
          role: (i === cur ? 'compare' : i < cur ? 'sorted' : 'default') as BarRole,
        })),
      )
      .setAux([
        {
          label: '障碍台阶',
          value:
            blocked
              .map((b, i) => (b ? String(i + 1) : ''))
              .filter(Boolean)
              .join(',') || '无',
          role: 'warn',
        },
      ])
      .commit();
  };

  snap({ zh: `共 ${n} 阶`, en: `${n} steps` });

  const hooks: ClimbStairsHooks = {
    onStep: (i, val, bl) => {
      dp[i] = val;
      cur = i;
      snap(
        bl
          ? { zh: `${i} 阶有障碍，dp=0`, en: `Step ${i} blocked, dp=0` }
          : { zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` },
      );
    },
  };

  const ans = climbStairsObstacle(blocked, hooks);

  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '总方案数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
