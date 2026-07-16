// =============================================================================
// 青蛙跳石头 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { frogJump, type FrogHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 9, 3, 1];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  let cur = -1;
  let total = 0;
  const path = new Set<number>();

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (path.has(i)) roles[i] = 'final';
      else if (i === cur) roles[i] = 'compare';
      else if (dp[i]! >= 0) roles[i] = 'frontier';
      labels[i] = dp[i]! < 0 ? String(input[i]) : `${input[i]}\n(${dp[i]})`;
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles, labels))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' },
        { label: '总代价', value: total ? String(total) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `cost = [${input.join(', ')}]`, en: `cost = [${input.join(', ')}]` });

  const hooks: FrogHooks = {
    onStep: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (t, p) => {
      total = t;
      cur = -1;
      path.clear();
      for (const idx of p) path.add(idx);
      snap({
        zh: `最小代价 ${t}，路径 [${p.join(',')}]`,
        en: `Min cost ${t}, path [${p.join(',')}]`,
      });
    },
  };

  frogJump(input, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(rec.barsFrom(input, Object.fromEntries([...path].map((i) => [i, 'final' as BarRole]))))
    .setAux([{ label: '答案', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
