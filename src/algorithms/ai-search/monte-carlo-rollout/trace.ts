// =============================================================================
// 纯蒙特卡洛模拟 · 录制帧序列
// 用 setBars 展示 wins/losses/draws 的累计计数，setAux 显示胜率与当前统计。
// 为控制帧数，每若干次 rollout 渲染一帧 + 终态帧。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monteCarloRollout, nimSum, type RolloutHooks } from './impl.ts';

export const DEFAULT_STATE: number[] = [3, 2];
export const DEFAULT_SIMULATIONS: number = 60;
export const DEFAULT_SEED: number = 42;
/** 每多少次 rollout 渲染一帧（避免帧过多）。 */
const FRAME_EVERY: number = 5;

export function buildTrace(
  state: number[] = DEFAULT_STATE,
  simulations: number = DEFAULT_SIMULATIONS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始 Nim 局面 [${state.join(',')}]，Nim-和=${nimSum(state)}，将模拟 ${simulations} 次，种子 ${seed}`,
      en: `Initial Nim [${state.join(',')}], Nim-sum=${nimSum(state)}, ${simulations} sims, seed ${seed}`,
    })
    .setBars([
      { value: 0, role: 'final' as BarRole, label: '胜' },
      { value: 0, role: 'warn' as BarRole, label: '负' },
      { value: 0, role: 'default' as BarRole, label: '平' },
    ])
    .setAux([
      { label: 'Nim-和', value: String(nimSum(state)), role: 'pivot' },
      { label: '胜率', value: '0.000', role: 'frontier' },
    ])
    .commit();

  let wins = 0;
  let losses = 0;
  let draws = 0;

  const renderFrame = (note: { zh: string; en: string }): void => {
    const total = wins + losses + draws;
    const winRate = total > 0 ? wins / total : 0;
    rec
      .begin(note)
      .setBars([
        { value: wins, role: 'final' as BarRole, label: '胜' },
        { value: losses, role: 'warn' as BarRole, label: '负' },
        { value: draws, role: 'default' as BarRole, label: '平' },
      ])
      .setAux([
        { label: '已模拟', value: `${total}/${simulations}`, role: 'pivot' },
        { label: '胜', value: String(wins), role: 'final' },
        { label: '负', value: String(losses), role: 'warn' },
        { label: '平', value: String(draws), role: 'default' },
        { label: '胜率', value: winRate.toFixed(3), role: 'frontier' },
      ])
      .commit();
  };

  const hooks: RolloutHooks = {
    onRollout: (i, outcome) => {
      if (outcome === 'win') wins++;
      else if (outcome === 'loss') losses++;
      else draws++;
      if ((i + 1) % FRAME_EVERY === 0) {
        renderFrame({
          zh: `已模拟 ${i + 1}/${simulations}：胜=${wins} 负=${losses} 平=${draws}`,
          en: `Simulated ${i + 1}/${simulations}: W=${wins} L=${losses} D=${draws}`,
        });
      }
    },
  };

  const result = monteCarloRollout(state, simulations, seed, hooks);

  // 终态帧
  rec
    .begin({
      zh: `完成：胜率 = ${result.winRate.toFixed(3)}（${result.wins}胜 / ${result.losses}负 / ${result.draws}平）`,
      en: `Done: win rate = ${result.winRate.toFixed(3)} (${result.wins}W / ${result.losses}L / ${result.draws}D)`,
    })
    .setBars([
      { value: result.wins, role: 'final' as BarRole, label: '胜' },
      { value: result.losses, role: 'warn' as BarRole, label: '负' },
      { value: result.draws, role: 'default' as BarRole, label: '平' },
    ])
    .setAux([
      { label: '总次数', value: String(result.total), role: 'final' },
      { label: '胜率', value: result.winRate.toFixed(3), role: 'final' },
      { label: 'Nim-和', value: String(nimSum(state)), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
