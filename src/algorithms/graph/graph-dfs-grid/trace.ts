// =============================================================================
// 网格 DFS（岛屿计数）· 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numIslands, type GridDfsHooks } from './impl.ts';

export const DEFAULT_GRID: string[][] = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];

export function buildTrace(grid: string[][] = DEFAULT_GRID): Frame[] {
  const rec = new TraceRecorder();
  const m = grid.length;
  const n = m > 0 ? grid[0]!.length : 0;
  const landmarked: boolean[][] = Array.from({ length: m }, () =>
    new Array<boolean>(n).fill(false),
  );
  let curR = -1;
  let curC = -1;
  let islandIdx = 0;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < m; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) {
        let role: BarRole = 'default';
        if (grid[r]![c] === '1') {
          if (r === curR && c === curC) role = 'compare';
          else if (landmarked[r]![c]) role = 'final';
        } else role = 'default';
        row.push({ v: grid[r]![c], role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 网格岛屿计数`, en: `${m}×${n} grid island count` });

  const hooks: GridDfsHooks = {
    onVisit: (r, c) => {
      landmarked[r]![c] = true;
      curR = r;
      curC = c;
      snap({ zh: `DFS 标记 (${r},${c})`, en: `DFS mark (${r},${c})` });
    },
    onIsland: (_sr, _sc, size) => {
      islandIdx++;
      curR = -1;
      curC = -1;
      snap({ zh: `岛屿 #${islandIdx}（${size} 格）`, en: `Island #${islandIdx} (${size} cells)` });
    },
    onResult: (t) => {
      curR = -1;
      curC = -1;
      snap({ zh: `岛屿数 = ${t}`, en: `Islands = ${t}` });
    },
  };

  const result = numIslands(grid, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '岛屿数 / islands', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
