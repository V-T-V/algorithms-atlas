// =============================================================================
// 跳跃游戏（贪心）· 录制帧序列
// 可视化：setArray 渲染 nums，指针标当前 i 与 maxReach。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpGame, type JumpGameGHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 1, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  rec
    .begin({
      zh: `跳跃游戏：nums=[${input.join(', ')}]，从 0 出发能否到 ${n - 1}`,
      en: `Jump Game: nums=[${input.join(', ')}], from 0 to ${n - 1}?`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: 'maxReach', value: '0', role: 'default' }])
    .commit();

  const hooks: JumpGameGHooks = {
    onStep: (i, numsI, mr) => {
      const pointers = [
        { index: i, label: 'i' },
        { index: Math.min(mr, n - 1), label: 'maxReach' },
      ];
      rec
        .begin({
          zh: `i=${i}（nums[i]=${numsI}）→ maxReach=${mr}`,
          en: `i=${i} (nums[i]=${numsI}) → maxReach=${mr}`,
        })
        .setArray(
          [...input],
          input.map((_, k) => {
            if (k === i) return 'swap' as BarRole;
            if (k <= mr) return 'sorted' as BarRole;
            return 'default' as BarRole;
          }),
          pointers,
        )
        .setAux([{ label: 'maxReach', value: String(mr), role: 'final' }])
        .commit();
    },
    onBreak: (i, mr) => {
      rec
        .begin({
          zh: `断链：i=${i} > maxReach=${mr}，不可达`,
          en: `Break: i=${i} > maxReach=${mr}, unreachable`,
        })
        .setArray(
          [...input],
          input.map(() => 'warn' as BarRole),
          [],
        )
        .commit();
    },
  };

  const result = jumpGame(input, hooks);

  rec
    .begin({
      zh: result.canReach
        ? `可达终点！maxReach=${result.maxReach}`
        : `不可达（maxReach=${result.maxReach}）`,
      en: result.canReach
        ? `Reachable! maxReach=${result.maxReach}`
        : `Unreachable (maxReach=${result.maxReach})`,
    })
    .setArray(
      [...input],
      input.map(() => (result.canReach ? 'final' : 'warn') as BarRole),
      [],
    )
    .setAux([
      {
        label: '能否到达',
        value: result.canReach ? '是' : '否',
        role: result.canReach ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
