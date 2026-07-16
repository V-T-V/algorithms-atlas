// =============================================================================
// A* 网格寻路 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aStarGrid, reconstructPath, type AStarGridHooks, type GridPoint } from './impl.ts';

// 0=通路，1=障碍
export const DEFAULT_GRID: ReadonlyArray<readonly number[]> = [
  [0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0],
];
export const DEFAULT_SOURCE: GridPoint = { r: 0, c: 0 };
export const DEFAULT_TARGET: GridPoint = { r: 3, c: 4 };

export function buildTrace(
  grid: ReadonlyArray<readonly number[]> = DEFAULT_GRID,
  source: GridPoint = DEFAULT_SOURCE,
  target: GridPoint = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const closed = new Set<string>();
  const open = new Set<string>();
  let popping: GridPoint | null = null;
  let cur: GridPoint | null = null;
  let pathRes: GridPoint[] | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const pathSet = new Set((pathRes ?? []).map((p) => `${p.r},${p.c}`));
    const rows: Cell[][] = grid.map((row, r) =>
      row.map((v, c) => {
        const k = `${r},${c}`;
        let role: BarRole = 'default';
        if (v === 1) role = 'warn';
        else if (pathSet.has(k)) role = 'final';
        else if (closed.has(k)) role = 'pivot';
        else if (open.has(k)) role = 'frontier';
        if (r === source.r && c === source.c) role = 'compare';
        if (r === target.r && c === target.c) role = 'swap';
        return { v: v === 1 ? '█' : cur && cur.r === r && cur.c === c ? '·' : '.', role };
      }),
    );
    rec.begin(note).setGrid(rows).commit();
  };

  render({
    zh: `网格 ${grid.length}×${grid[0]?.length}，S→T`,
    en: `Grid ${grid.length}x${grid[0]?.length}, S->T`,
  });

  const hooks: AStarGridHooks = {
    onPop: (p) => {
      popping = p;
      cur = p;
      render({ zh: `弹出 (${p.r},${p.c})`, en: `Pop (${p.r},${p.c})` });
    },
    onRelax: (_from, to, _g, improved) => {
      cur = to;
      if (improved) open.add(`${to.r},${to.c}`);
      render({ zh: `松弛 (${to.r},${to.c})`, en: `Relax (${to.r},${to.c})` });
    },
    onDone: (found) => {
      cur = null;
      render({ zh: found ? '找到路径' : '无路径', en: found ? 'Path found' : 'No path' });
    },
  };

  const res = aStarGrid(grid, source, target, hooks);
  if (res.found) {
    pathRes = reconstructPath(res.prev, source, target);
    closed.clear();
    render({ zh: `路径长度=${res.dist}`, en: `Path length=${res.dist}` });
  }

  return rec.build();
}
