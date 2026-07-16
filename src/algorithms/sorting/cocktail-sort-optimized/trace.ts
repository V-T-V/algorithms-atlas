// =============================================================================
// 优化鸡尾酒排序 · 录制帧序列
// 通过 cocktailSortOptimized 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cocktailSortOptimized, type CocktailOptHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 1, 4, 2, 8, 0, 3, 9, 7, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const n = a.length;
  const sorted = new Set<number>();
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;
  let bounds: [number, number] = [0, n - 1];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k < n; k++) if (sorted.has(k)) roles[k] = 'sorted';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c] || roles[c] === 'default') roles[c] = 'compare';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([
        { label: '未排序左界 lo', value: String(bounds[0]), role: 'frontier' },
        { label: '未排序右界 hi', value: String(bounds[1]), role: 'frontier' },
      ])
      .commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: CocktailOptHooks = {
    onForwardStart: (lo, hi) => {
      bounds = [lo, hi];
      snapshot({ zh: `正向扫描 [${lo}, ${hi}]`, en: `Forward pass [${lo}, ${hi}]` });
    },
    onBackwardStart: (lo, hi) => {
      bounds = [lo, hi];
      snapshot({ zh: `反向扫描 [${lo}, ${hi}]`, en: `Backward pass [${lo}, ${hi}]` });
    },
    onCompare: (i, j) => {
      comparing.add(i);
      comparing.add(j);
    },
    onSwap: (i, j) => {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      pendingSwap = [i, j];
      snapshot({ zh: `交换 [${i}]↔[${j}]`, en: `Swap [${i}]↔[${j}]` });
    },
    onJumpHi: (newHi) => {
      snapshot({
        zh: `右界跳跃到 ${newHi}（最后交换位置）`,
        en: `Right bound jumps to ${newHi} (last swap)`,
      });
    },
    onJumpLo: (newLo) => {
      snapshot({
        zh: `左界跳跃到 ${newLo}（最后交换位置）`,
        en: `Left bound jumps to ${newLo} (last swap)`,
      });
    },
    onSorted: (i) => {
      sorted.add(i);
    },
  };

  cocktailSortOptimized(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
