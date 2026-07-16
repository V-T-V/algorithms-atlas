// =============================================================================
// 跳跃游戏 · 录制帧序列
// 用 setBars 展示数组：当前位置 'compare'，最远可达范围内的格子 'frontier'，末格 'final'。
// 用 setAux 展示最远可达值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpGame, type JumpGameHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 1, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nums = input;
  const n = nums.length;

  let curI = -1;
  let maxReach = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k <= maxReach && k < n; k++) roles[k] = k === n - 1 ? 'final' : 'frontier';
    if (curI >= 0) roles[curI] = 'compare';
    if (n - 1 >= 0) roles[n - 1] = 'final';
    rec
      .begin(note)
      .setBars(rec.barsFrom(nums, roles))
      .setAux([{ label: '最远可达 / maxReach', value: String(maxReach), role: 'frontier' }])
      .commit();
  };

  snapshot({ zh: `数组：[${nums.join(', ')}]`, en: `Array: [${nums.join(', ')}]` });

  const hooks: JumpGameHooks = {
    onVisit: (i) => {
      curI = i;
    },
    onExtend: (i, newReach) => {
      maxReach = newReach;
      curI = i;
      snapshot({
        zh: `在 ${i} 扩展最远可达至 ${newReach}`,
        en: `At ${i}, extend maxReach to ${newReach}`,
      });
    },
  };

  const result = jumpGame(nums, hooks);

  curI = -1;
  rec
    .begin({ zh: result ? '可达末格' : '不可达', en: result ? 'Reachable' : 'Unreachable' })
    .setBars(
      rec.barsFrom(
        nums,
        result ? Object.fromEntries(nums.map((_, i) => [i, 'final' as BarRole])) : {},
      ),
    )
    .setAux([{ label: '结果 / result', value: result ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
