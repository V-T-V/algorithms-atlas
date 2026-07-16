// =============================================================================
// 墙与门 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wallsAndGates, INF, type WallAndGatesHooks } from './impl.ts';

export const DEFAULT_ROOMS = () => [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];

export function buildTrace(rooms: number[][] = DEFAULT_ROOMS()): Frame[] {
  const rec = new TraceRecorder();
  const m = rooms.length;
  const n = m > 0 ? rooms[0]!.length : 0;
  let curR = -1;
  let curC = -1;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < m; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) {
        let role: BarRole = 'default';
        const v = rooms[r]![c]!;
        if (r === curR && c === curC) role = 'compare';
        else if (v === -1) role = 'warn';
        else if (v === 0) role = 'pivot';
        else if (v === INF) role = 'default';
        else role = 'frontier';
        row.push({ v: v === -1 ? '墙' : v === 0 ? '门' : v === INF ? '∞' : `${v}`, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 房间，多源 BFS`, en: `${m}×${n} rooms, multi-source BFS` });

  const hooks: WallAndGatesHooks = {
    onVisit: (r, c, d) => {
      curR = r;
      curC = c;
      snap({ zh: `填 (${r},${c}) = ${d}`, en: `Fill (${r},${c}) = ${d}` });
    },
    onResult: () => {
      curR = -1;
      curC = -1;
      snap({ zh: '完成', en: 'Done' });
    },
  };

  wallsAndGates(rooms, hooks);

  rec.begin({ zh: '所有空房已填距离', en: 'All rooms filled' }).setGrid(renderGrid()).commit();

  return rec.build();
}
