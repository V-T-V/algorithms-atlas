// =============================================================================
// 双指针 · 录制帧序列
// 用 setArray 展示有序数组，pointers 标 left/right 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSumSorted, type TwoPointerHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const DEFAULT_TARGET = 10;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  let left = 0;
  let right = input.length - 1;
  const found: Array<[number, number]> = [];
  let lastFound: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map(() => 'default');
    for (const [a, b] of found) {
      if (a < input.length) roles[a] = 'final';
      if (b < input.length) roles[b] = 'final';
    }
    if (left >= 0 && left < input.length) roles[left] = 'compare';
    if (right >= 0 && right < input.length) {
      if (left !== right) roles[right] = 'swap';
      else if (roles[right] === 'default') roles[right] = 'pivot';
    }
    if (lastFound) {
      roles[lastFound[0]] = 'final';
      roles[lastFound[1]] = 'final';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (left >= 0 && left < input.length) pointers.push({ index: left, label: 'L' });
    if (right >= 0 && right < input.length && right !== left) {
      pointers.push({ index: right, label: 'R' });
    }

    rec.begin(note).setArray(input, roles, pointers).commit();
    lastFound = null;
  };

  snapshot({
    zh: `升序数组，目标和 = ${target}。L=0, R=${input.length - 1}`,
    en: `Sorted array, target = ${target}. L=0, R=${input.length - 1}`,
  });

  const hooks: TwoPointerHooks = {
    onCompare: (l, r, sum) => {
      left = l;
      right = r;
      snapshot({
        zh: `比较 a[${l}]+a[${r}] = ${input[l]}+${input[r]} = ${sum}（目标 ${target}）`,
        en: `Compare a[${l}]+a[${r}] = ${input[l]}+${input[r]} = ${sum} (target ${target})`,
      });
    },
    onMoveLeft: (l) => {
      left = l;
    },
    onMoveRight: (r) => {
      right = r;
    },
    onFound: (l, r) => {
      found.push([l, r]);
      lastFound = [l, r];
      snapshot({
        zh: `命中！a[${l}]+a[${r}] = ${target}，记录解 (${input[l]}, ${input[r]})`,
        en: `Hit! a[${l}]+a[${r}] = ${target}, record pair (${input[l]}, ${input[r]})`,
      });
    },
  };

  const result = twoSumSorted(input, target, hooks);

  // 终态
  const roles: BarRole[] = input.map(() => 'default');
  for (const [a, b] of result.allPairs) {
    roles[a] = 'final';
    roles[b] = 'final';
  }
  rec
    .begin({
      zh: result.allPairs.length > 0 ? `完成：共找到 ${result.allPairs.length} 组解` : '完成：无解',
      en:
        result.allPairs.length > 0
          ? `Done: found ${result.allPairs.length} pair(s)`
          : 'Done: no pair',
    })
    .setArray(input, roles, [])
    .commit();

  return rec.build();
}
