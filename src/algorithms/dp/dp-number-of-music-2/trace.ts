// =============================================================================
// 播放列表方案数 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { musicPlaylist, type MusicPlaylistHooks } from './impl.ts';

export const DEFAULT_N = 3;
export const DEFAULT_GOAL = 3;
export const DEFAULT_K = 1;

export function buildTrace(
  n: number = DEFAULT_N,
  goal: number = DEFAULT_GOAL,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();
  const grid: bigint[][] = [];
  let ans = 0;

  rec
    .begin({ zh: `n=${n} goal=${goal} k=${k}`, en: `n=${n} goal=${goal} k=${k}` })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'goal', value: String(goal), role: 'frontier' },
      { label: 'k', value: String(k), role: 'pivot' },
    ])
    .commit();

  const hooks: MusicPlaylistHooks = {
    onSlot: (i, dp) => {
      grid.push(dp);
      const rows: Cell[][] = grid.map((row, r) =>
        row.map((v) => ({
          v: String(v),
          role: (r === grid.length - 1 ? 'pivot' : 'default') as Cell['role'],
        })),
      );
      rec
        .begin({
          zh: `i=${i}: dp=[${dp.map((v) => String(v)).join(',')}]`,
          en: `i=${i}: dp=[${dp.map((v) => String(v)).join(',')}]`,
        })
        .setGrid(rows)
        .commit();
    },
    onDone: (w) => {
      ans = w;
    },
  };

  musicPlaylist(n, goal, k, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: '方案数 (mod 1e9+7)', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
