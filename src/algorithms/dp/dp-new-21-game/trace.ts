// =============================================================================
// 新 21 点 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { new21Game, type New21Hooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 6, k: 1, w: 10 };

export function buildTrace(input: { n: number; k: number; w: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k, w } = input;
  const probs: Array<{ x: number; p: number }> = [];
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(
        probs.map(({ x, p }) => ({
          key: `dp[${x}]`,
          value: p.toFixed(4),
          role: x === 0 ? ('final' as const) : ('default' as const),
        })),
      )
      .commit();
  };

  snap({ zh: `N=${n}, K=${k}, W=${w}`, en: `N=${n}, K=${k}, W=${w}` });

  const hooks: New21Hooks = {
    onCell: (x, p) => {
      probs.push({ x, p });
      snap({ zh: `dp[${x}] = ${p.toFixed(4)}`, en: `dp[${x}] = ${p.toFixed(4)}` });
    },
    onResult: (p) => {
      ans = p;
      snap({ zh: `答案 dp[0] = ${p.toFixed(4)}`, en: `Answer dp[0] = ${p.toFixed(4)}` });
    },
  };

  new21Game(n, k, w, hooks);

  rec
    .begin({ zh: `完成：${ans.toFixed(4)}`, en: `Done: ${ans.toFixed(4)}` })
    .setMap([{ key: 'P(score<=N)', value: ans.toFixed(4), role: 'final' }])
    .commit();

  return rec.build();
}
