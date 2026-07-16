// =============================================================================
// 赛车 · 录制帧序列
// 可视化：setArray 渲染位置轴（标当前位置）；setAux 展示 speed/steps。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { raceCar, type RaceCarHooks } from './impl.ts';

export const DEFAULT_INPUT = 3;

/** 录制演示帧序列。 */
export function buildTrace(target: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const span = Math.max(target * 2 + 1, 5);
  let curSpeed = 1;

  const render = (
    note: { zh: string; en: string },
    pos: number,
    speed: number,
    steps: number,
    done: boolean,
  ): void => {
    // 位置轴：0..span-1，负位置映射到 0
    const positions = Array.from({ length: span }, (_, i) => i);
    const roles: BarRole[] = positions.map((p) => {
      if (done && p === target) return 'final';
      if (p === pos) return 'swap';
      if (p === target) return 'pivot';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos >= 0 && pos < span) pointers.push({ index: pos, label: `车` });
    if (target >= 0 && target < span) pointers.push({ index: target, label: `目标` });
    rec
      .begin(note)
      .setArray(positions, roles, pointers)
      .setAux([
        { label: '位置 pos', value: String(pos), role: 'swap' },
        { label: '速度 speed', value: String(speed), role: 'compare' },
        { label: '步数 steps', value: String(steps), role: 'default' },
        { label: '目标', value: String(target), role: 'pivot' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `赛车：起点 pos=0，speed=1，目标=${target}（A 加速/R 反向）`,
      en: `Race Car: start pos=0, speed=1, target=${target} (A accel / R reverse)`,
    })
    .setArray(
      Array.from({ length: span }, (_, i) => i),
      Array.from({ length: span }, (_, p) => (p === target ? ('pivot' as BarRole) : 'default')),
      [{ index: 0, label: '车' }],
    )
    .commit();

  const hooks: RaceCarHooks = {
    onExpand: (pos, speed, steps) => {
      curSpeed = speed;
      render(
        {
          zh: `扩展状态 pos=${pos}, speed=${speed}, steps=${steps}`,
          en: `Expand pos=${pos}, speed=${speed}, steps=${steps}`,
        },
        pos,
        speed,
        steps,
        false,
      );
    },
    onDone: (_t, steps) => {
      render(
        { zh: `到达目标！最短 ${steps} 步`, en: `Reached! min ${steps} steps` },
        target,
        curSpeed,
        steps,
        true,
      );
    },
  };

  const result = raceCar(target, hooks);

  rec
    .begin({ zh: `完成：最短 ${result} 步`, en: `Done: ${result} steps` })
    .setArray(
      Array.from({ length: span }, (_, i) => i),
      Array.from({ length: span }, (_, p) => (p === target ? ('final' as BarRole) : 'default')),
      [],
    )
    .setAux([{ label: '最短步数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
