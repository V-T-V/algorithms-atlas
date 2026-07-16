// =============================================================================
// 青蛙跳 2 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { frog2, type Frog2Hooks } from './impl.ts';

export const DEFAULT_HEIGHTS = [40, 10, 20, 70, 80, 10, 20, 70, 80, 0];
export const DEFAULT_K = 4;

export function buildTrace(
  heights: readonly number[] = DEFAULT_HEIGHTS,
  K: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  const n = heights.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  dp[0] = 0;
  let cur = -1;
  let fromIdx = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = heights.map((_, i) =>
      i === cur ? 'compare' : i === fromIdx ? 'swap' : dp[i]! >= 0 ? 'frontier' : 'default',
    );
    const labels: Record<number, string> = {};
    dp.forEach((v, i) => (labels[i] = v < 0 ? '' : `${v}`));
    rec
      .begin(note)
      .setBars(rec.barsFrom(heights, Object.fromEntries(roles.map((r, i) => [i, r])), labels))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'frontier' },
        { label: 'K', value: String(K), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `heights=[${heights.join(', ')}] K=${K}`,
    en: `heights=[${heights.join(', ')}] K=${K}`,
  });

  const hooks: Frog2Hooks = {
    onLand: (i, val, from) => {
      dp[i] = val;
      cur = i;
      fromIdx = from;
      snap({ zh: `dp[${i}] = ${val}（来自 ${from}）`, en: `dp[${i}] = ${val} (from ${from})` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      fromIdx = -1;
      snap({ zh: `最小代价 = ${t}`, en: `Min cost = ${t}` });
    },
  };

  frog2(heights, K, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(heights))
    .setAux([{ label: '代价 / cost', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
