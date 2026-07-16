// =============================================================================
// 青蛙跳·困难版 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { frogJumpHard, type FrogHardHooks } from './impl.ts';

export const DEFAULT_INPUT = { cost: [0, 3, 5, 1, 2, 6, 4, 8], maxJump: 3 };

export function buildTrace(
  input: { cost: readonly number[]; maxJump: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const cost = input.cost;
  const n = cost.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  let cur = -1;
  let fromJ = -1;
  let total = 0;
  const path = new Set<number>();

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (path.has(i)) roles[i] = 'final';
      else if (i === cur) roles[i] = 'compare';
      else if (dp[i]! >= 0) roles[i] = 'frontier';
      labels[i] = dp[i]! < 0 ? String(cost[i]) : `${cost[i]}\n(${dp[i]})`;
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(cost, roles, labels))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' },
        { label: 'maxJump', value: String(input.maxJump), role: 'frontier' },
        { label: '总代价', value: total ? String(total) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  snap({
    zh: `cost = [${cost.join(', ')}], maxJump = ${input.maxJump}`,
    en: `cost = [${cost.join(', ')}], maxJump = ${input.maxJump}`,
  });

  const hooks: FrogHardHooks = {
    onStep: (i, val, from) => {
      dp[i] = val;
      cur = i;
      fromJ = from;
      snap({
        zh: `dp[${i}] = ${val}${from >= 0 ? ` ← from ${from}` : ''}`,
        en: `dp[${i}] = ${val}${from >= 0 ? ` <- from ${from}` : ''}`,
      });
    },
    onResult: (t, p) => {
      total = t;
      cur = -1;
      path.clear();
      for (const idx of p) path.add(idx);
      void fromJ;
      snap({
        zh: `最小代价 ${t}，路径 [${p.join(',')}]`,
        en: `Min cost ${t}, path [${p.join(',')}]`,
      });
    },
  };

  frogJumpHard(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(rec.barsFrom(cost, Object.fromEntries([...path].map((i) => [i, 'final' as BarRole]))))
    .setAux([{ label: '答案', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
