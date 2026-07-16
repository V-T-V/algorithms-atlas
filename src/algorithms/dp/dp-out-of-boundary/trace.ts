// =============================================================================
// 出界路径数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPaths, type OutOfBoundaryHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 2, n: 2, maxMove: 2, r: 0, c: 0 };

export function buildTrace(
  input: { m: number; n: number; maxMove: number; r: number; c: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { m, n, maxMove, r, c } = input;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[r]![c] = 1;
  let total = 0;
  let curStep = 0;

  const renderGrid = (step: number): Cell[][] => {
    const grid: Cell[][] = [];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === r && j === c && step === 0) role = 'compare';
        if (dp[i]![j]! > 0 && step > 0) role = 'frontier';
        row.push({ v: dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid(curStep))
      .setAux([{ label: '累计出界', value: String(total), role: 'warn' }])
      .commit();
  };

  snap({ zh: `起点 (${r},${c})，最多 ${maxMove} 步`, en: `Start (${r},${c}), maxMove ${maxMove}` });

  const hooks: OutOfBoundaryHooks = {
    onStep: (step, t) => {
      total = t;
      curStep = step;
      // 重新展示当前 dp（需要重新跑？这里 impl 已推进 dp，外部无法直接拿；改用累计）
      snap({ zh: `第 ${step} 步后累计出界 ${t}`, en: `After move ${step}: ${t} out-of-bound` });
    },
    onResult: (t) => {
      total = t;
      snap({ zh: `总出界路径 = ${t}`, en: `Total out-of-bound paths = ${t}` });
    },
  };

  findPaths(m, n, maxMove, r, c, 1_000_000_007, hooks);

  rec
    .begin({ zh: `完成：${total}`, en: `Done: ${total}` })
    .setGrid(renderGrid(0))
    .setAux([{ label: '答案', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
