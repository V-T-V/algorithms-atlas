// =============================================================================
// 跳跃游戏 II · 录制帧序列
// 可视化：setArray 渲染 nums，指针标当前层 [l, r] 与 nextEnd。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jumpGame2, type JumpGame2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 1, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  let layerL = 0;
  let layerR = 0;

  rec
    .begin({
      zh: `跳跃游戏 II：nums=[${input.join(', ')}]，求到 ${n - 1} 的最少跳跃次数`,
      en: `Jump Game II: nums=[${input.join(', ')}], min jumps to ${n - 1}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: '跳跃数', value: '0', role: 'default' }])
    .commit();

  const hooks: JumpGame2Hooks = {
    onStep: (i, numsI, nextEnd) => {
      rec
        .begin({
          zh: `当前层 [${layerL}..${layerR}]：i=${i}（nums[i]=${numsI}）→ nextEnd=${nextEnd}`,
          en: `Layer [${layerL}..${layerR}]: i=${i} (nums[i]=${numsI}) → nextEnd=${nextEnd}`,
        })
        .setArray(
          [...input],
          input.map((_, k) => {
            if (k === i) return 'swap' as BarRole;
            if (k >= layerL && k <= layerR) return 'sorted' as BarRole;
            return 'default' as BarRole;
          }),
          [
            { index: Math.min(layerL, n - 1), label: 'l' },
            { index: Math.min(layerR, n - 1), label: 'r' },
            { index: Math.min(nextEnd, n - 1), label: 'next' },
          ],
        )
        .commit();
    },
    onJump: (layerEnd, nextEnd, jumps) => {
      layerL = layerEnd + 1;
      layerR = nextEnd;
      rec
        .begin({
          zh: `跳一次 → 第 ${jumps} 跳，下一层 [${layerL}..${layerR}]`,
          en: `Jump #${jumps}, next layer [${layerL}..${layerR}]`,
        })
        .setArray(
          [...input],
          input.map((_, k) =>
            k >= layerL && k <= layerR ? ('pivot' as BarRole) : ('default' as BarRole),
          ),
          [],
        )
        .setAux([{ label: '跳跃数', value: String(jumps), role: 'final' }])
        .commit();
    },
  };

  const result = jumpGame2(input, hooks);

  rec
    .begin({ zh: `完成：最少 ${result} 跳`, en: `Done: min ${result} jumps` })
    .setArray(
      [...input],
      input.map(() => 'final' as BarRole),
      [],
    )
    .setAux([{ label: '最少跳跃次数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
