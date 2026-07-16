// =============================================================================
// 跳跃查找 · 录制帧序列
// setArray：跳跃阶段高亮 bound，二分阶段 lo/mid/hi 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gallopSearch, type GallopSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
export const DEFAULT_TARGET = 17;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let bound = 0;
  let lo = 0;
  let hi = n - 1;
  let mid = -1;
  let phase: 'gallop' | 'binary' = 'gallop';

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (phase === 'binary') {
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      if (mid >= 0) roles[mid] = 'pivot';
    } else if (bound > 0) {
      roles[bound] = 'compare';
    }
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> =
      phase === 'binary'
        ? [
            { index: lo, label: 'lo' },
            { index: mid, label: 'mid' },
            { index: hi, label: 'hi' },
          ]
        : bound > 0
          ? [{ index: bound, label: 'jump' }]
          : [];
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snap({ zh: `跳跃查找 ${target}`, en: `Gallop search ${target}` });

  const hooks: GallopSearchHooks = {
    onJump: (pos) => {
      bound = pos;
      phase = 'gallop';
      snap({ zh: `跳跃到 ${pos}，a[${pos}]=${values[pos]} < ${target}`, en: `Jump to ${pos}` });
    },
    onProbe: (curLo, curHi, curMid) => {
      phase = 'binary';
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({ zh: `二分 mid=${mid}，a[${mid}]=${values[mid]}`, en: `Binary mid=${mid}` });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (idx >= 0) roles[idx] = 'final';
      rec
        .begin(
          idx >= 0 ? { zh: `命中 ${idx}`, en: `Found ${idx}` } : { zh: '未找到', en: 'Not found' },
        )
        .setArray(values, roles, idx >= 0 ? [{ index: idx, label: '✓' }] : [])
        .commit();
    },
  };

  gallopSearch(input, target, hooks);
  return rec.build();
}
