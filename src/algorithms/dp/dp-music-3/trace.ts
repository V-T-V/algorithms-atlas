import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numMusicPlaylists, type MusicHooks } from './impl.ts';

export const DEFAULT_N = 3,
  DEFAULT_GOAL = 3,
  DEFAULT_K = 1;

export function buildTrace(
  n: number = DEFAULT_N,
  goal: number = DEFAULT_GOAL,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(goal + 1).fill(0);
  dp[0] = 1;
  rec
    .begin({ zh: `n=${n} goal=${goal} k=${k}`, en: `n=${n} goal=${goal} k=${k}` })
    .setBars(
      dp.map((v, i) => ({
        value: v,
        role: (i === 0 ? 'sorted' : 'default') as BarRole,
        label: String(i),
      })),
    )
    .commit();
  const hooks: MusicHooks = {
    onLen: (i, val) => {
      dp[i] = val;
      rec
        .begin({ zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` })
        .setBars(
          dp.map((v, j) => ({
            value: v,
            role: (j === i ? 'compare' : 'default') as BarRole,
            label: String(j),
          })),
        )
        .commit();
    },
  };
  const ans = numMusicPlaylists(n, goal, k, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `Count=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
