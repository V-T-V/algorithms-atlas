// =============================================================================
// 蛇梯棋 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snakesAndLadders, type SnakeLadderHooks } from './impl.ts';

// 经典示例：6x6，含一个梯子和一个蛇
export const DEFAULT_BOARD: ReadonlyArray<readonly number[]> = [
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 35, -1, -1, 13, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 15, -1, -1, -1, -1],
];

export function buildTrace(board: ReadonlyArray<readonly number[]> = DEFAULT_BOARD): Frame[] {
  const rec = new TraceRecorder();
  const n = board.length;
  const target = n * n;
  const visited = new Set<number>([1]);
  let cur = 1;
  let ans = -1;

  const render = (note: { zh: string; en: string }): void => {
    // 把方格编号画到网格（反推 (row,col)）
    const grid: Cell[][] = board.map((row) =>
      row.map((v) => ({ v: v < 0 ? '' : String(v), role: 'default' as BarRole })),
    );
    // 标记已访问与当前
    for (let sq = 1; sq <= target; sq++) {
      const idx = sq - 1;
      const rfb = Math.floor(idx / n);
      const row = n - 1 - rfb;
      let col = idx % n;
      if (rfb % 2 === 1) col = n - 1 - col;
      const cell = grid[row]![col]!;
      cell.v = String(sq);
      cell.role = sq === cur ? 'pivot' : visited.has(sq) ? 'final' : 'default';
    }
    rec.begin(note).setGrid(grid).commit();
  };

  render({ zh: `起始格 1，目标 ${target}`, en: `Start 1, target ${target}` });

  const hooks: SnakeLadderHooks = {
    onVisit: (sq, rolls) => {
      visited.add(sq);
      cur = sq;
      render({ zh: `访问格 ${sq}（${rolls} 步）`, en: `Visit ${sq} (${rolls} rolls)` });
    },
    onRoll: (from, to) => {
      // 仅记录，不渲染（避免帧过多）
    },
    onDone: (r) => {
      ans = r;
      cur = target;
      render({ zh: r < 0 ? '无法到达' : `最少 ${r} 步`, en: r < 0 ? 'unreachable' : `${r} rolls` });
    },
  };

  snakesAndLadders(board, hooks);

  rec
    .begin({ zh: ans < 0 ? '无解' : `完成：${ans}`, en: ans < 0 ? 'No solution' : `Done: ${ans}` })
    .setAux([{ label: '最少步数', value: ans < 0 ? '-1' : String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
