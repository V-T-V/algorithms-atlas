// =============================================================================
// 播放列表数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numberOfMusicPlaylists, type MusicHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 3, goal: 3, k: 1 };

export function buildTrace(input: { n: number; goal: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, goal, k } = input;
  const dp: number[][] = Array.from({ length: goal + 1 }, () => new Array<number>(n + 1).fill(0));
  dp[0]![0] = 1;
  let curI = -1;
  let curJ = -1;
  let ans = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'i\\j', role: 'default' },
      ...Array.from({ length: n + 1 }, (_, j) => ({ v: j, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let i = 0; i <= goal; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' as BarRole }];
      for (let j = 0; j <= n; j++) {
        let role: BarRole = 'default';
        if (i === goal && j === n && ans > 0) role = 'final';
        else if (i === curI && j === curJ) role = 'compare';
        row.push({ v: dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '参数', value: `n=${n}, goal=${goal}, k=${k}` }])
      .commit();
  };

  snap({ zh: `n=${n}, goal=${goal}, k=${k}`, en: `n=${n}, goal=${goal}, k=${k}` });

  const hooks: MusicHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      curI = -1;
      curJ = -1;
      snap({ zh: `方案数 = ${t}`, en: `Count = ${t}` });
    },
  };

  numberOfMusicPlaylists(n, goal, k, 1_000_000_007, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
