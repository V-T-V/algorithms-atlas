// 象棋残局 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameChessEndgame, type GameChessEndgameHooks } from './impl.ts';

export const DEFAULT_INPUT = { size: 4, attacker: 0, defender: 15 };

export function buildTrace(
  input: { size: number; attacker: number; defender: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { size, attacker, defender } = input;

  rec
    .begin({
      zh: `${size}×${size} 棋盘，攻击者 ${attacker} 追防守 ${defender}`,
      en: `${size}x${size} board, attacker ${attacker} hunts defender ${defender}`,
    })
    .setAux([
      { label: 'attacker', value: String(attacker), role: 'compare' },
      { label: 'defender', value: String(defender), role: 'warn' },
    ])
    .commit();

  const hooks: GameChessEndgameHooks = {
    onMemo: (state, distance) => {
      rec
        .begin({
          zh: `状态 ${state} → 距离 ${distance === Infinity ? '∞' : distance}`,
          en: `State ${state} -> distance ${distance === Infinity ? '∞' : distance}`,
        })
        .setAux([
          { label: state, value: distance === Infinity ? '∞' : String(distance), role: 'final' },
        ])
        .commit();
    },
  };

  const result = gameChessEndgame(size, attacker, defender, size * size, hooks);

  rec
    .begin({
      zh: `完成：将杀需 ${result.mateIn === -1 ? '不可将杀' : result.mateIn + ' 步'}`,
      en: `Done: mate in ${result.mateIn === -1 ? 'impossible' : result.mateIn + ' steps'}`,
    })
    .setBars([{ value: result.mateIn < 0 ? 0 : result.mateIn, role: 'final' as BarRole }])
    .setAux([{ label: 'mateIn', value: String(result.mateIn), role: 'final' }])
    .commit();

  return rec.build();
}
