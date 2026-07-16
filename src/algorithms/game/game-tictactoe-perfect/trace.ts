// 完美井字棋 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameTictactoePerfect } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 0, 0, 2, 0, 0, 0, 1];

const SYMBOLS = ['·', 'X', 'O'];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const grid = (b: number[], mark: Record<number, BarRole> = {}): Cell[][] =>
    [b.slice(0, 3), b.slice(3, 6), b.slice(6, 9)].map((row, r) =>
      row.map((v, c) => ({
        v: SYMBOLS[v]!,
        role: mark[r * 3 + c] ?? 'default',
      })),
    );

  rec
    .begin({ zh: '给定局面，求最优落子', en: 'Given position, find optimal move' })
    .setGrid(grid(input))
    .commit();

  const result = gameTictactoePerfect(input);

  rec
    .begin({
      zh: `最优落子格 ${result.bestMove}，价值 ${result.value}`,
      en: `Best move cell ${result.bestMove}, value ${result.value}`,
    })
    .setGrid(grid(input, result.bestMove >= 0 ? { [result.bestMove]: 'final' as BarRole } : {}))
    .setAux([
      { label: '最优格', value: String(result.bestMove), role: 'final' },
      { label: '价值', value: String(result.value), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
