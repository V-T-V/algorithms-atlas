// 内省选择 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { introselect, type IntroSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6, 0, 5, 8], k: 5, seed: 1 };

export function buildTrace(
  input: { arr: number[]; k: number; seed?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k, seed = 1 } = input;
  const a = [...arr];
  const pinned = new Set<number>();
  let curStrategy = 'random';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([
        {
          label: '当前策略',
          value: curStrategy === 'mom' ? 'median-of-medians' : '随机快选',
          role: curStrategy === 'mom' ? 'warn' : ('pivot' as BarRole),
        },
      ])
      .commit();
  };

  snapshot({ zh: `找第 ${k + 1} 小（0-based k=${k}）`, en: `Find rank-${k} (0-based)` });

  const hooks: IntroSelectHooks = {
    onFallback: (depth, limit) => {
      curStrategy = 'mom';
      snapshot({
        zh: `递归深度 ${depth} ≥ 阈值 ${limit}，切换到 median-of-medians`,
        en: `Depth ${depth} ≥ limit ${limit}, switch to median-of-medians`,
      });
    },
    onPartition: (lo, hi, strategy) => {
      curStrategy = strategy;
      snapshot({
        zh: `划分 [${lo}, ${hi}]（${strategy === 'mom' ? 'BFPRT 基准' : '随机基准'}）`,
        en: `Partition [${lo}, ${hi}] (${strategy === 'mom' ? 'BFPRT pivot' : 'random pivot'})`,
      });
    },
    onPinned: (p) => {
      pinned.add(p);
      snapshot({ zh: `下标 ${p}（值 ${a[p]}）就位`, en: `Index ${p} (value ${a[p]}) placed` });
    },
  };

  const ans = introselect(arr, k, seed, hooks);
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < a.length; i++) roles[i] = 'final';
  rec
    .begin({ zh: `第 ${k + 1} 小 = ${ans}`, en: `Rank-${k + 1} smallest = ${ans}` })
    .setBars(rec.barsFrom(a, roles))
    .setAux([{ label: '结果', value: String(ans), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
