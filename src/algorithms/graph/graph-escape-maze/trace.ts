// =============================================================================
// 迷宫逃脱 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { escapeMaze, type MazeHooks, type MazePoint } from './impl.ts';

export const DEFAULT_MAZE: ReadonlyArray<readonly string[]> = [
  ['S', '.', '.', '#', '.'],
  ['#', '#', '.', '#', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '#', '#', '#', 'E'],
];

export function buildTrace(maze: ReadonlyArray<readonly string[]> = DEFAULT_MAZE): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>();
  let cur: MazePoint | null = null;
  let ans = -1;

  const render = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = maze.map((row, r) =>
      row.map((ch, c) => {
        let role: BarRole = 'default';
        if (ch === '#' || ch === '1') role = 'warn';
        else if (ch === 'S') role = 'compare';
        else if (ch === 'E') role = 'swap';
        else if (cur && cur.r === r && cur.c === c) role = 'pivot';
        else if (visited.has(`${r},${c}`)) role = 'frontier';
        return { v: ch, role };
      }),
    );
    rec.begin(note).setGrid(rows).commit();
  };

  render({ zh: '迷宫 S→E', en: 'Maze S->E' });

  const hooks: MazeHooks = {
    onVisit: (p, d) => {
      visited.add(`${p.r},${p.c}`);
      cur = p;
      render({ zh: `访问 (${p.r},${p.c}) d=${d}`, en: `Visit (${p.r},${p.c}) d=${d}` });
    },
    onDone: (found, d) => {
      ans = found ? d : -1;
      cur = null;
      render({ zh: found ? `最短=${d}` : '无法逃脱', en: found ? `shortest=${d}` : 'no escape' });
    },
  };

  escapeMaze(maze, hooks);

  rec
    .begin({ zh: ans < 0 ? '无解' : `完成：${ans}`, en: ans < 0 ? 'No path' : `Done: ${ans}` })
    .setAux([{ label: '最短步数', value: ans < 0 ? '-1' : String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
