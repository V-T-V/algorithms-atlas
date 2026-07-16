// =============================================================================
// 滑动谜题 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingPuzzle, type SlidingPuzzleHooks } from './impl.ts';

export const DEFAULT_BOARD = [
  [4, 1, 2],
  [5, 0, 3],
];

export function buildTrace(board: number[][] = DEFAULT_BOARD): Frame[] {
  const rec = new TraceRecorder();
  let ans = 0;

  const toState = (b: number[][]): string => b.map((row) => row.join('')).join('');
  const renderGrid = (state: string): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < 2; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < 3; c++) {
        const d = state[r * 3 + c]!;
        row.push({ v: d === '0' ? '·' : d, role: (d === '0' ? 'pivot' : 'default') as BarRole });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }, state: string, dist: number): void => {
    rec
      .begin(note)
      .setGrid(renderGrid(state))
      .setAux([
        { label: '状态', value: state, role: 'compare' },
        { label: '步数', value: String(dist), role: 'frontier' },
        { label: '目标', value: '123450', role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: '开始滑动谜题', en: 'Start sliding puzzle' }, toState(board), 0);

  const hooks: SlidingPuzzleHooks = {
    onVisit: (state, dist) =>
      snap({ zh: `访问 ${state}（${dist}）`, en: `Visit ${state} (${dist})` }, state, dist),
    onResult: (t) => {
      ans = t;
    },
  };

  const result = slidingPuzzle(board, hooks);

  rec
    .begin({
      zh: result < 0 ? '不可达' : `完成：${result} 步`,
      en: result < 0 ? 'Unreachable' : `Done: ${result} moves`,
    })
    .setGrid(renderGrid(result < 0 ? toState(board) : '123450'))
    .setAux([{ label: '步数 / moves', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
