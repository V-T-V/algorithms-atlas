// =============================================================================
// 平方跳跃搜索 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpSearchSquared, type JumpSquaredHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
export const DEFAULT_TARGET = 15;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  const step = Math.floor(Math.sqrt(n));

  let jumpPos = -1;
  let blockLo = -1;
  let blockHi = -1;
  let cur = -1;
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
    { zh: `step = √${n} = ${step}，查找 ${target}`, en: `step = √${n} = ${step}, find ${target}` },
    [],
  );

  const hooks: JumpSquaredHooks = {
    onJump: (pos) => {
      phase = 'jump';
      jumpPos = pos;
      const v = values[pos]!;
      snapshot(
        {
          zh: `跳到 a[${pos}]=${v} ${v < target ? '< 目标，继续' : '≥ 目标，停'}`,
          en: `Jump a[${pos}]=${v} ${v < target ? '< target, jump on' : '≥ target, stop'}`,
        },
        [{ index: pos, label: 'pos' }],
      );
    },
    onBlock: (lo, hi) => {
      phase = 'block';
      blockLo = lo;
      blockHi = hi;
      snapshot({ zh: `候选块 [${lo}, ${hi})`, en: `Candidate block [${lo}, ${hi})` }, [
        { index: lo, label: 'lo' },
        { index: Math.max(hi - 1, 0), label: 'hi-1' },
      ]);
    },
    onLinearCompare: (i) => {
      phase = 'linear';
      cur = i;
      const v = values[i]!;
      const rel = v < target ? '< 目标' : v > target ? '> 目标（停）' : '= 目标';
      snapshot({ zh: `比较 a[${i}]=${v} ${rel}`, en: `Compare a[${i}]=${v} ${rel}` }, [
        { index: i, label: 'i' },
      ]);
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at ${found}` }
            : { zh: `未找到 ${target}`, en: `${target} not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  jumpSearchSquared(input, target, hooks);

  return rec.build();
}
