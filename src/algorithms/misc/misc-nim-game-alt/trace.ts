// =============================================================================
// Nim 游戏变种 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canWinNim, playNim, type NimAltHooks } from './impl.ts';

export const DEFAULT_N = 10;
export const DEFAULT_MAX = 3;

export function buildTrace(n: number = DEFAULT_N, maxTake: number = DEFAULT_MAX): Frame[] {
  const rec = new TraceRecorder();
  const moves: Array<{ player: number; stones: number; remaining: number }> = [];

  const firstWins = canWinNim(n, maxTake);

  rec
    .begin({
      zh: `n=${n}，每次取 1..${maxTake}，先手${firstWins ? '必胜' : '必败'}`,
      en: `n=${n}, take 1..${maxTake}, first ${firstWins ? 'wins' : 'loses'}`,
    })
    .setAux([
      { label: '石子数', value: String(n), role: 'pivot' as BarRole },
      { label: '最大取数', value: String(maxTake), role: 'compare' as BarRole },
      {
        label: '先手',
        value: firstWins ? '必胜' : '必败',
        role: (firstWins ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  const hooks: NimAltHooks = {
    onMove: (player, stones, remaining) => moves.push({ player, stones, remaining }),
  };

  const { winner } = playNim(n, maxTake, hooks);

  for (const m of moves) {
    rec
      .begin({
        zh: `玩家${m.player} 取 ${m.stones} 个，剩余 ${m.remaining}`,
        en: `Player ${m.player} takes ${m.stones}, ${m.remaining} left`,
      })
      .setAux([
        { label: '玩家', value: String(m.player), role: 'compare' as BarRole },
        { label: '取', value: String(m.stones), role: 'pivot' as BarRole },
        { label: '剩余', value: String(m.remaining), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `玩家${winner} 胜`, en: `Player ${winner} wins` })
    .setAux([{ label: '胜者', value: String(winner), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
