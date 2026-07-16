// =============================================================================
// 搜索重复元素 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchDuplicate, type SearchDuplicateHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];
export const DEFAULT_TARGET = 5;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let phase: 'left' | 'right' = 'left';
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (probe >= 0) roles[probe] = 'compare';
    rec
      .begin(note)
      .setArray(
        values,
        roles,
        probe >= 0 ? [{ index: probe, label: phase === 'left' ? 'L' : 'R' }] : [],
      )
      .setAux([{ label: '阶段', value: phase === 'left' ? '最左二分' : '最右二分', role: 'pivot' }])
      .commit();
  };

  snapshot({
    zh: `在含重复的升序数组中统计 ${target}`,
    en: `Count ${target} in sorted array with duplicates`,
  });

  const hooks: SearchDuplicateHooks = {
    onLeftProbe: (mid, cmp) => {
      phase = 'left';
      probe = mid;
      const rel = cmp === 0 ? '= 目标（向左继续）' : cmp < 0 ? '< 目标' : '> 目标';
      snapshot({
        zh: `最左二分 a[${mid}]=${values[mid]} ${rel}`,
        en: `Leftmost a[${mid}]=${values[mid]} ${rel}`,
      });
    },
    onRightProbe: (mid, cmp) => {
      phase = 'right';
      probe = mid;
      const rel = cmp === 0 ? '= 目标（向右继续）' : cmp < 0 ? '< 目标' : '> 目标';
      snapshot({
        zh: `最右二分 a[${mid}]=${values[mid]} ${rel}`,
        en: `Rightmost a[${mid}]=${values[mid]} ${rel}`,
      });
    },
    onDone: (res) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (res.found) for (let k = res.first; k <= res.last; k++) roles[k] = 'final';
      rec
        .begin(
          res.found
            ? {
                zh: `${target} 出现在 [${res.first}, ${res.last}]，共 ${res.count} 次`,
                en: `${target} in [${res.first}, ${res.last}], count ${res.count}`,
              }
            : { zh: `${target} 不存在`, en: `${target} absent` },
        )
        .setArray(values, roles, [])
        .commit();
    },
  };

  searchDuplicate(input, target, hooks);

  return rec.build();
}
