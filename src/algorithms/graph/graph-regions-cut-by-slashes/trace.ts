// =============================================================================
// 斜杠划分区域 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regionsBySlashes, type RegionsBySlashesHooks } from './impl.ts';

export const DEFAULT_GRID = [' /', '/ '];

export function buildTrace(grid: string[] = DEFAULT_GRID): Frame[] {
  const rec = new TraceRecorder();
  const n = grid.length;
  const N = n * 3;
  const g: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const ch = grid[i]![j]!;
      if (ch === '/') {
        g[i * 3]![j * 3 + 2] = 1;
        g[i * 3 + 1]![j * 3 + 1] = 1;
        g[i * 3 + 2]![j * 3] = 1;
      } else if (ch === '\\') {
        g[i * 3]![j * 3] = 1;
        g[i * 3 + 1]![j * 3 + 1] = 1;
        g[i * 3 + 2]![j * 3 + 2] = 1;
      }
    }
  }
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < N; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < N; c++) {
        const v = g[r]![c]!;
        row.push({ v: v === 1 ? '█' : '·', role: (v === 1 ? 'warn' : 'default') as BarRole });
      }
      rows.push(row);
    }
    return rows;
  };

  rec
    .begin({ zh: `原始网格 ${n}×${n} → 放大 ${N}×${N}`, en: `${n}×${n} grid → ${N}×${N}` })
    .setGrid(renderGrid())
    .setAux(grid.map((row, i) => ({ label: `row${i}`, value: row, role: 'pivot' as BarRole })))
    .commit();

  const hooks: RegionsBySlashesHooks = {
    onResult: (r) => {
      ans = r;
    },
  };
  const result = regionsBySlashes(grid, hooks);

  rec
    .begin({ zh: `完成：${result} 个区域`, en: `Done: ${result} regions` })
    .setGrid(renderGrid())
    .setAux([{ label: '区域数 / regions', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
