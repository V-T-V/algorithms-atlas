// =============================================================================
// 灯泡开关 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bulbSwitchSimulate, type BulbSwitcherHooks } from './impl.ts';

export const DEFAULT_INPUT = 9;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const rounds: Array<{ round: number; onCount: number }> = [];

  rec
    .begin({
      zh: `${input} 个灯泡，模拟 ${input} 轮`,
      en: `${input} bulbs, simulate ${input} rounds`,
    })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: BulbSwitcherHooks = {
    onRound: (round, onCount) => rounds.push({ round, onCount }),
  };

  const result = bulbSwitchSimulate(input, hooks);

  // 只展示部分轮次（前 5 + 后 2）
  const showRounds = rounds.length <= 7 ? rounds : [...rounds.slice(0, 5), ...rounds.slice(-2)];
  for (let i = 0; i < showRounds.length; i++) {
    const r = showRounds[i]!;
    rec
      .begin({
        zh: `第 ${r.round} 轮：切换 ${r.round} 的倍数，当前亮 ${r.onCount}`,
        en: `Round ${r.round}: toggle multiples of ${r.round}, ${r.onCount} on`,
      })
      .setAux([
        { label: '轮次', value: String(r.round), role: 'compare' as BarRole },
        { label: '亮灯数', value: String(r.onCount), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：亮灯数 = ${result} = floor(sqrt(${input}))`,
      en: `Done: ${result} = floor(sqrt(${input}))`,
    })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
