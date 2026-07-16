// Connect4 求解器 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameConnect4Solve } from './impl.ts';

export const DEFAULT_INPUT = { depth: 5 };

export function buildTrace(input: { board?: number[][]; depth?: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const depth = input.depth ?? 5;
  const board = input.board ?? [];

  rec
    .begin({
      zh: `Connect4 求最优落列（深度 ${depth}）`,
      en: `Connect4 best column (depth ${depth})`,
    })
    .setAux([{ label: 'depth', value: String(depth), role: 'pivot' }])
    .commit();

  const result = gameConnect4Solve(board, depth, {
    onScore: (col, value) => {
      rec
        .begin({
          zh: `列 ${col} 价值 ${value}`,
          en: `Column ${col} value ${value}`,
        })
        .setAux([{ label: `col ${col}`, value: String(value), role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({
      zh: `最优落列 ${result.bestCol}，价值 ${result.value}`,
      en: `Best column ${result.bestCol}, value ${result.value}`,
    })
    .setAux([
      { label: '最优列', value: String(result.bestCol), role: 'final' },
      { label: '价值', value: String(result.value), role: 'final' },
    ])
    .commit();

  return rec.build();
}
