// 迷宫最短路径回溯 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btMazeShortest, type BtMazeShortestHooks } from './impl.ts';

export const DEFAULT_GRID: ReadonlyArray<readonly number[]> = [
  [1, 1, 0, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 1, 0, 1, 1],
];
export const DEFAULT_INPUT = {
  grid: DEFAULT_GRID,
  start: [0, 0] as [number, number],
  goal: [2, 4] as [number, number],
};

export function buildTrace(
  input: {
    grid: ReadonlyArray<readonly number[]>;
    start: [number, number];
    goal: [number, number];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { grid, start, goal } = input;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const baseRoles = (mark: Record<string, BarRole>): Cell[][] =>
    grid.map((row, r) =>
      row.map((v, c) => ({
        v: v === 0 ? '#' : '.',
        role: mark[`${r},${c}`] ?? (v === 0 ? 'warn' : 'default'),
      })),
    );

  rec
    .begin({
      zh: `迷宫 ${rows}×${cols}，从 (${start}) 到 (${goal})`,
      en: `Maze ${rows}x${cols}, from (${start}) to (${goal})`,
    })
    .setGrid(
      baseRoles({ [`${start[0]},${start[1]}`]: 'frontier', [`${goal[0]},${goal[1]}`]: 'final' }),
    )
    .commit();

  const pathSet = new Set<string>();
  const hooks: BtMazeShortestHooks = {
    onStep: (r, c) => {
      pathSet.add(`${r},${c}`);
      rec
        .begin({ zh: `走到 (${r},${c})`, en: `Step to (${r},${c})` })
        .setGrid(
          baseRoles({
            [`${r},${c}`]: 'compare',
            [`${start[0]},${start[1]}`]: 'frontier',
            [`${goal[0]},${goal[1]}`]: 'final',
          }),
        )
        .commit();
    },
    onReach: () => {
      rec
        .begin({ zh: '到达终点', en: 'Reached goal' })
        .setAux([{ label: '命中', value: '到达终点', role: 'final' }])
        .commit();
    },
    onBest: (length) => {
      rec
        .begin({ zh: `更新最短：${length} 步`, en: `New best: ${length} steps` })
        .setAux([{ label: '最短', value: String(length), role: 'final' }])
        .commit();
    },
  };

  const result = btMazeShortest(grid, start, goal, hooks);

  const bestRoles: Record<string, BarRole> = {};
  result.path.forEach(([r, c]) => {
    bestRoles[`${r},${c}`] = 'final';
  });
  rec
    .begin({
      zh: `完成：最短 ${result.length} 步`,
      en: `Done: shortest ${result.length} steps`,
    })
    .setGrid(baseRoles(bestRoles))
    .setAux([
      { label: '最短步数', value: String(result.length), role: 'final' },
      {
        label: '路径',
        value: result.path.map((p) => `(${p[0]},${p[1]})`).join('→'),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
