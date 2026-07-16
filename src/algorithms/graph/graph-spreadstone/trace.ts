// =============================================================================
// 石子蔓延 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spreadStones, type SpreadStoneHooks } from './impl.ts';

export const DEFAULT_GRID = [
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 2],
  [0, 0, 0, 0],
];

export function buildTrace(grid: number[][] = DEFAULT_GRID): Frame[] {
  const rec = new TraceRecorder();
  const m = grid.length;
  const n = m > 0 ? grid[0]!.length : 0;
  const dist: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curR = -1;
  let curC = -1;
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < m; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) {
        let role: BarRole = 'default';
        if (grid[r]![c]! > 0) role = 'pivot';
        else if (r === curR && c === curC) role = 'compare';
        else if (dist[r]![c]! >= 0) role = 'frontier';
        const v = grid[r]![c]! > 0 ? `S${grid[r]![c]}` : dist[r]![c]! >= 0 ? `${dist[r]![c]}` : '·';
        row.push({ v, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 网格石子蔓延`, en: `${m}×${n} grid stone spread` });

  const hooks: SpreadStoneHooks = {
    onVisit: (r, c, d) => {
      dist[r]![c] = d;
      curR = r;
      curC = c;
      snap({ zh: `蔓延到 (${r},${c}) = ${d}`, en: `Spread to (${r},${c}) = ${d}` });
    },
    onResult: (maxD) => {
      ans = maxD;
      curR = -1;
      curC = -1;
      snap({ zh: `最大蔓延距离 = ${maxD}`, en: `Max spread = ${maxD}` });
    },
  };

  const result = spreadStones(grid, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大距离', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
