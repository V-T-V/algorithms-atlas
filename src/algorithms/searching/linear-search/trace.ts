// =============================================================================
// 线性查找 · 录制帧序列
// 通过 linearSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearSearch, type LinearSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 3;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  let cur = -1;
  // 已扫过但未命中的下标
  const scanned: number[] = [];

  const snapshot = (
    note: { zh: string; en: string },
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    const roles: BarRole[] = new Array(values.length).fill('default');
    for (const s of scanned) roles[s] = 'sorted'; // 用 sorted 色表示「已排除」
    if (cur >= 0 && cur < values.length) roles[cur] = 'compare';
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot(
    {
      zh: `在数组中顺序查找 ${target}`,
      en: `Scan the array sequentially for ${target}`,
    },
    [],
  );

  const hooks: LinearSearchHooks = {
    onProbe: (i) => {
      cur = i;
      snapshot(
        {
          zh: `检查下标 ${i}：a[${i}]=${values[i]} ${values[i] === target ? '== ' + target : '≠ ' + target}`,
          en: `Check index ${i}: a[${i}]=${values[i]} ${values[i] === target ? '== ' + target : '≠ ' + target}`,
        },
        [{ index: i, label: 'i' }],
      );
      // 若本格未命中，则把它标记为已扫描
      if (values[i] !== target) scanned.push(i);
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(values.length).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at index ${found}` }
            : { zh: `未找到 ${target}`, en: `${target} not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  linearSearch(input, target, hooks);

  return rec.build();
}
