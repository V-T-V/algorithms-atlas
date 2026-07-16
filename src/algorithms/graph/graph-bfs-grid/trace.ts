// =============================================================================
// 网格 BFS · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gridBfs, type GridBfsHooks } from './impl.ts';

export const DEFAULT_GRID = [
  [0, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 0, 0, 0],
  [0, 1, 1, 0],
];
export const DEFAULT_SR = 0;
export const DEFAULT_SC = 0;
export const DEFAULT_TR = 3;
export const DEFAULT_TC = 3;

export function buildTrace(
  grid: number[][] = DEFAULT_GRID,
  sr: number = DEFAULT_SR,
  sc: number = DEFAULT_SC,
  tr: number = DEFAULT_TR,
  tc: number = DEFAULT_TC,
): Frame[] {
  const rec = new TraceRecorder();
  const m = grid.length;
  const n = m > 0 ? grid[0]!.length : 0;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
  const distGrid: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curR = -1;
  let curC = -1;
  let ans = -1;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < m; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) {
        let role: BarRole = 'default';
        if (grid[r]![c] !== 0) role = 'warn';
        else if (r === curR && c === curC) role = 'compare';
        else if (r === sr && c === sc) role = 'pivot';
        else if (r === tr && c === tc) role = 'final';
        else if (visited[r]![c]) role = 'frontier';
        const v = distGrid[r]![c]! >= 0 ? `${distGrid[r]![c]}` : grid[r]![c] !== 0 ? 'X' : '·';
        row.push({ v, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `从 (${sr},${sc}) 到 (${tr},${tc})`, en: `From (${sr},${sc}) to (${tr},${tc})` });

  const hooks: GridBfsHooks = {
    onVisit: (r, c, d) => {
      visited[r]![c] = true;
      distGrid[r]![c] = d;
      curR = r;
      curC = c;
      snap({ zh: `访问 (${r},${c}) 距离=${d}`, en: `Visit (${r},${c}) dist=${d}` });
    },
    onResult: (res) => {
      ans = res;
      curR = -1;
      curC = -1;
      snap({
        zh: res < 0 ? '不可达' : `最短步数 = ${res}`,
        en: res < 0 ? 'Unreachable' : `Shortest = ${res}`,
      });
    },
  };

  gridBfs(grid, sr, sc, tr, tc, hooks);

  rec
    .begin({
      zh: ans < 0 ? '不可达' : `完成：${ans}`,
      en: ans < 0 ? 'Unreachable' : `Done: ${ans}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '步数 / steps', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
