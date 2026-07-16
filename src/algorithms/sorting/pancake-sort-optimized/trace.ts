// =============================================================================
// 优化煎饼排序 · 录制帧序列
// 通过 pancakeSortOptimized 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pancakeSortOptimized, type PancakeOptHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 5, 2, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const n = a.length;
  const pinned = new Set<number>();
  let flipCount = 0;
  let hi = n - 1;
  let maxIdx = -1;
  let flipRange: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k < n; k++) if (pinned.has(k)) roles[k] = 'sorted';
    if (flipRange) for (let k = 0; k <= flipRange[0]; k++) roles[k] = 'swap';
    if (maxIdx >= 0 && !roles[maxIdx]) roles[maxIdx] = 'pivot';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([
        { label: '未排序段右界', value: String(hi), role: 'frontier' },
        { label: '最大值下标', value: maxIdx < 0 ? '—' : String(maxIdx), role: 'pivot' },
        { label: '累计翻转', value: String(flipCount), role: 'final' },
      ])
      .commit();
    flipRange = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: PancakeOptHooks = {
    onFindMax: (h, mi) => {
      hi = h;
      maxIdx = mi;
      snapshot({ zh: `未排序段 [0,${h}] 最大值在 ${mi}`, en: `Max of [0,${h}] at ${mi}` });
    },
    onSkip: (h) => {
      snapshot({ zh: `最大值已在 ${h}，跳过翻转`, en: `Max already at ${h}, skip flips` });
    },
    onFlip: (k) => {
      // 真实翻转
      let l = 0;
      let r = k;
      while (l < r) {
        const t = a[l]!;
        a[l] = a[r]!;
        a[r] = t;
        l++;
        r--;
      }
      flipCount++;
      flipRange = [k, 0];
      snapshot({
        zh: `翻转前缀 [0,${k}]（第 ${flipCount} 次）`,
        en: `Flip prefix [0,${k}] (flip #${flipCount})`,
      });
    },
    onPinned: (i) => {
      pinned.add(i);
      maxIdx = -1;
    },
  };

  pancakeSortOptimized(input, hooks);

  rec
    .begin({ zh: `排序完成（共 ${flipCount} 次翻转）`, en: `Sorted (${flipCount} flips)` })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
