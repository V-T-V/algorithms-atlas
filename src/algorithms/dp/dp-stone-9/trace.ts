// =============================================================================
// 石子合并 · 录制
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeStones, type MergeStonesHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5];

export function buildTrace(stones: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = stones.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  let cur = { i: 0, j: 0 };

  const snap = (note: { zh: string; en: string }): void => {
    const g: Cell[][] = dp.map((row, i) =>
      row.map((v, j) => ({
        v: j >= i ? String(v) : '.',
        role: i === cur.i && j === cur.j ? 'compare' : 'default',
      })),
    );
    rec
      .begin(note)
      .setGrid(g)
      .setAux([{ label: 'stones', value: stones.join(','), role: 'frontier' }])
      .commit();
  };

  snap({ zh: `stones=[${stones.join(',')}]`, en: `stones=[${stones.join(',')}]` });

  const hooks: MergeStonesHooks = {
    onCombine: (i, j, _k, _c) => {
      cur = { i, j };
    },
  };

  const ans = mergeStones(stones, hooks);

  // 重新填一次 dp 用于展示
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = Infinity;
      for (let k = i; k < j; k++) best = Math.min(best, dp[i]![k]! + dp[k + 1]![j]!);
      dp[i]![j] = best + (prefix[j + 1]! - prefix[i]!);
    }
  }
  cur = { i: 0, j: n - 1 };
  snap({ zh: `最小总代价=${ans}`, en: `Min total cost=${ans}` });

  rec
    .begin({ zh: `答案=${ans}`, en: `ans=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
