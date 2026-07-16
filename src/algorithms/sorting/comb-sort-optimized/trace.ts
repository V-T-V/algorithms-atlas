// =============================================================================
// 优化梳排序 · 录制帧序列
// 通过 combSortOptimized 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combSortOptimized, type CombSortOptHooks } from './impl.ts';

export const DEFAULT_INPUT = [8, 4, 1, 5, 9, 2, 6, 3, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;
  let curGap = 0;
  let curPhase: 'comb' | 'bubble' = 'comb';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: CombSortOptHooks = {
    onGap: (gap, phase) => {
      curGap = gap;
      curPhase = phase;
      snapshot({
        zh: `${phase === 'bubble' ? '冒泡阶段' : '梳阶段'}：gap = ${gap}`,
        en: `${phase === 'bubble' ? 'Bubble phase' : 'Comb phase'}: gap = ${gap}`,
      });
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
      snapshot({
        zh: `gap=${curGap} 交换 [${i}]↔[${j}]`,
        en: `gap=${curGap} swap [${i}]↔[${j}]`,
      });
    },
    onPassEnd: (swapped) => {
      snapshot({
        zh: `本轮 ${curPhase === 'bubble' ? '冒泡' : '梳'} 结束${swapped ? '' : '（无交换）'}`,
        en: `Pass end${swapped ? '' : ' (no swap)'}`,
      });
    },
  };

  combSortOptimized(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
