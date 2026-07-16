// =============================================================================
// 骑士留在棋盘概率 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knightProbability, type KnightHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 3, k: 2, r: 0, c: 0 };

export function buildTrace(
  input: { n: number; k: number; r: number; c: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, k, r, c } = input;
  let prob = 1;

  const fmtProb = (p: number): string => (p < 1e-6 ? '·' : p.toFixed(4));

  // 由于 impl 内部 dp 滚动，这里 trace 只能展示「累计概率」，用 aux 展示
  const snap = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = [];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        const role: BarRole = i === r && j === c && prob === 1 ? 'compare' : 'default';
        row.push({ v: i === r && j === c ? '马' : '', role });
      }
      grid.push(row);
    }
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([{ label: '留在棋盘概率', value: prob.toFixed(4), role: 'final' }])
      .commit();
  };

  snap({
    zh: `${n}×${n} 棋盘，从 (${r},${c}) 走 ${k} 步`,
    en: `${n}x${n} board, (${r},${c}), ${k} moves`,
  });

  const hooks: KnightHooks = {
    onStep: (step, p) => {
      prob = p;
      snap({
        zh: `第 ${step} 步后留在棋盘概率 = ${fmtProb(p)}`,
        en: `After move ${step}: P(on-board) = ${fmtProb(p)}`,
      });
    },
    onResult: (p) => {
      prob = p;
      snap({ zh: `最终概率 = ${fmtProb(p)}`, en: `Final probability = ${fmtProb(p)}` });
    },
  };

  knightProbability(n, k, r, c, hooks);

  rec
    .begin({ zh: `完成：${prob.toFixed(4)}`, en: `Done: ${prob.toFixed(4)}` })
    .setGrid([])
    .setAux([{ label: '概率', value: prob.toFixed(4), role: 'final' }])
    .commit();

  return rec.build();
}
