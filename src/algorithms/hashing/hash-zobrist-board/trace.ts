import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zobristHash, zobristMove } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const board = new Array<number>(64).fill(-1);
  board[0] = 0;
  board[1] = 1;
  rec.begin({ zh: 'Zobrist 棋盘', en: 'Zobrist board' }).commit();
  let h = zobristHash(board);
  rec
    .begin({
      zh: `初始 hash 0x${h.toString(16).slice(0, 12)}`,
      en: `init hash 0x${h.toString(16).slice(0, 12)}`,
    })
    .setAux([
      { label: 'hash', value: '0x' + h.toString(16).slice(0, 12), role: 'pivot' as BarRole },
    ])
    .commit();
  h = zobristMove(h, 0, 5, 0);
  rec
    .begin({
      zh: `移动后 hash 0x${h.toString(16).slice(0, 12)}`,
      en: `after move 0x${h.toString(16).slice(0, 12)}`,
    })
    .setAux([
      { label: 'hash', value: '0x' + h.toString(16).slice(0, 12), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
