// =============================================================================
// 打家劫舍 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { houseRobber, type HouseRobberHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 9, 3, 1];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  const taken = new Set<number>();
  let cur = -1;
  let finalChosen = new Set<number>();

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (finalChosen.has(i)) roles[i] = 'final';
      else if (taken.has(i)) roles[i] = 'swap';
      else if (i === cur) roles[i] = 'compare';
      else if (dp[i]! >= 0) roles[i] = 'frontier';
      labels[i] = dp[i]! < 0 ? String(input[i]) : `${input[i]}\n(dp=${dp[i]})`;
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles, labels))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' },
        { label: '已抢', value: taken.size ? [...taken].join(',') : '∅', role: 'swap' },
      ])
      .commit();
  };

  snap({ zh: `nums = [${input.join(', ')}]`, en: `nums = [${input.join(', ')}]` });

  const hooks: HouseRobberHooks = {
    onStep: (i, val, took) => {
      dp[i] = val;
      cur = i;
      if (took) taken.add(i);
      snap({
        zh: `dp[${i}] = ${val}${took ? '（抢）' : '（不抢）'}`,
        en: `dp[${i}] = ${val}${took ? ' (rob)' : ' (skip)'}`,
      });
    },
    onResult: (total, chosen) => {
      cur = -1;
      taken.clear();
      finalChosen = new Set(chosen);
      snap({
        zh: `最大收益 ${total}，抢下标 [${chosen.join(',')}]`,
        en: `Max ${total}, robbed [${chosen.join(',')}]`,
      });
    },
  };

  houseRobber(input, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(
      rec.barsFrom(input, Object.fromEntries([...finalChosen].map((i) => [i, 'final' as BarRole]))),
    )
    .setAux([{ label: '答案', value: String(dp[n - 1] ?? 0), role: 'final' }])
    .commit();

  return rec.build();
}
