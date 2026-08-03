// 滑动窗口 · 录制帧序列
// 用 setArray（带指针的数组视图）呈现 [left, right] 窗口的扩张与收缩，
// 并把历史最优窗口高亮，让「双指针无重复子数组」过程可视化。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindow, type SlidingWindowHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 2, 3, 1, 5, 2, 6, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];

  // 当前窗口 [left, right] 与历史最优 [bestLeft, bestRight]
  let left = 0;
  let right = -1;
  let bestLeft = 0;
  let bestRight = -1;
  let bestLen = 0;

  const rolesFor = (): BarRole[] => {
    const roles: BarRole[] = new Array(a.length).fill('default');
    // 历史最优窗口先染 frontier（淡）
    for (let i = bestLeft; i <= bestRight; i++) roles[i] = 'frontier';
    // 当前窗口再覆盖一层（窗口内的元素）
    for (let i = left; i <= right; i++) roles[i] = 'compare';
    // 右端（刚纳入的元素）特别强调
    if (right >= 0) roles[right] = 'pivot';
    return roles;
  };

  const snapshot = (note: { zh: string; en: string }, pointersExtra = true): void => {
    const pointers: Array<{ index: number; label: string }> = [
      { index: Math.max(left, 0), label: 'L' },
    ];
    if (right >= 0 && pointersExtra) pointers.push({ index: right, label: 'R' });
    rec.begin(note).setArray(a, rolesFor(), pointers).commit();
  };

  rec
    .begin({
      zh: `初始数组：${a.join(', ')}。求最长无重复元素子数组。`,
      en: `Initial: ${a.join(', ')}. Find longest subarray with all-distinct values.`,
    })
    .setArray(a, new Array(a.length).fill('default'), [])
    .commit();

  const hooks: SlidingWindowHooks = {
    onShrink: (newLeft, r) => {
      left = newLeft;
      right = r;
      snapshot({
        zh: `发现重复，左指针收缩到 L=${left}，窗口 [${left}, ${right}]`,
        en: `Duplicate found; shrink left to L=${left}, window [${left}, ${right}]`,
      });
    },
    onExpand: (l, r) => {
      left = l;
      right = r;
      snapshot({
        zh: `右指针扩展到 R=${right}，窗口 [${left}, ${right}] 内元素互异`,
        en: `Expand right to R=${right}; window [${left}, ${right}] is duplicate-free`,
      });
    },
    onUpdateBest: (bl, br, len) => {
      bestLeft = bl;
      bestRight = br;
      bestLen = len;
      snapshot({
        zh: `更新最优：[${bestLeft}, ${bestRight}]，长度 ${bestLen}`,
        en: `New best: [${bestLeft}, ${bestRight}], length ${bestLen}`,
      });
    },
    onResult: (bl, br, len) => {
      bestLeft = bl;
      bestRight = br;
      bestLen = len;
    },
  };

  slidingWindow(input, hooks);

  // 终态：高亮最优窗口
  const finalRoles: BarRole[] = new Array(a.length).fill('default');
  for (let i = bestLeft; i <= bestRight; i++) finalRoles[i] = 'final';
  rec
    .begin({
      zh: `完成：最长无重复子数组 [${bestLeft}, ${bestRight}]，长度 ${bestLen}`,
      en: `Done: longest duplicate-free window [${bestLeft}, ${bestRight}], length ${bestLen}`,
    })
    .setArray(a, finalRoles, [])
    .setAux([
      { label: '最优长度', value: String(bestLen), role: 'final' },
      { label: '最优起点', value: String(bestLeft), role: 'compare' },
    ])
    .commit();

  return rec.build();
}
