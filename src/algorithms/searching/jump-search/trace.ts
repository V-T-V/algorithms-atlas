// =============================================================================
// 跳跃搜索 · 录制帧序列
// 通过 jumpSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpSearch, type JumpSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 15;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let jumpPos = -1; // 当前跳跃探测下标
  let blockLo = -1; // 候选块左端
  let blockHi = -1; // 候选块右端（不含）
  let cur = -1; // 线性扫描当前下标
  let phase: 'jump' | 'block' | 'linear' = 'jump';

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (blockLo >= 0 && blockHi >= 0) {
      for (let k = blockLo; k < blockHi; k++) roles[k] = 'frontier';
    }
    if (phase === 'jump' && jumpPos >= 0) roles[jumpPos] = 'pivot';
    if (phase === 'linear' && cur >= 0) roles[cur] = 'compare';
    return roles;
  };

  const snapshot = (
    note: { zh: string; en: string },
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snapshot(
    {
      zh: `升序数组中查找 ${target}，步长 = √${n} = ${Math.floor(Math.sqrt(n))}`,
      en: `Search ${target} in sorted array, step = √${n} = ${Math.floor(Math.sqrt(n))}`,
    },
    [],
  );

  const hooks: JumpSearchHooks = {
    onJump: (pos) => {
      phase = 'jump';
      jumpPos = pos;
      snapshot(
        {
          zh: `跳跃探测 a[${pos}]=${values[pos]} ${values[pos]! < target ? '< 目标，继续右跳' : '≥ 目标，停在此块'}`,
          en: `Jump probe a[${pos}]=${values[pos]} ${values[pos]! < target ? '< target, jump on' : '≥ target, stop here'}`,
        },
        [{ index: pos, label: 'pos' }],
      );
    },
    onBlock: (lo, hi) => {
      phase = 'block';
      blockLo = lo;
      blockHi = hi;
      snapshot(
        {
          zh: `定位到候选块 [${lo}, ${hi})，开始线性扫描`,
          en: `Target is in block [${lo}, ${hi}); linear scan`,
        },
        [
          { index: lo, label: 'lo' },
          { index: Math.max(hi - 1, 0), label: 'hi-1' },
        ],
      );
    },
    onLinearCompare: (i) => {
      phase = 'linear';
      cur = i;
      const v = values[i]!;
      const rel = v < target ? '< 目标' : v > target ? '> 目标（停止）' : '= 目标';
      snapshot(
        {
          zh: `线性比较 a[${i}]=${v} ${rel}`,
          en: `Linear compare a[${i}]=${v} ${rel}`,
        },
        [{ index: i, label: 'i' }],
      );
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
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

  jumpSearch(input, target, hooks);

  return rec.build();
}
