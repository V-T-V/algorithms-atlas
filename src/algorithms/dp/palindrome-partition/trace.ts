// =============================================================================
// 回文分割 · 录制帧序列
// 上半部分用 grid 展示「回文表 pal[i][j]」（标记发现的回文区间）；
// 下半部分用单行展示 dp[i]（最少段数）。当前格标 'compare'，回文区标 'pivot'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { palindromePartition, type PalindromePartitionHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabbc';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;

  // 回文表（模拟 impl 内部结构）
  const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  const dp: number[] = new Array<number>(n + 1).fill(-1);
  dp[0] = 0;
  let curI = -1;
  let curJ = -1;
  let mode: 'pal' | 'dp' = 'pal';
  const palCells = new Set<string>(); // "i,j" 为回文

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    // 回文表：行 i 起点列 j 终点
    const hpal: Cell[] = [{ v: 'pal[i][j]', role: 'default' }];
    for (let j = 0; j < n; j++) hpal.push({ v: s[j]!, role: 'pivot' });
    rows.push(hpal);
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `${s[i]!}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (j < i) {
          row.push({ v: ' ', role });
          continue;
        }
        if (palCells.has(`${i},${j}`)) role = 'pivot';
        if (mode === 'pal' && curI === i && curJ === j) role = 'compare';
        row.push({ v: pal[i]![j]! ? '✓' : '·', role });
      }
      rows.push(row);
    }
    return rows;
  };

  const renderDp = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i', role: 'default' }];
    for (let i = 0; i <= n; i++) header.push({ v: i, role: 'pivot' });
    const segRow: Cell[] = [{ v: 'dp[i]', role: 'pivot' }];
    for (let i = 0; i <= n; i++) {
      let role: BarRole = 'default';
      if (mode === 'dp' && curI === i) role = 'compare';
      segRow.push({ v: dp[i]! < 0 ? '·' : dp[i]!, role });
    }
    return [header, segRow];
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(mode === 'pal' ? renderGrid() : renderDp())
      .commit();
  };

  snap({ zh: `预处理回文表：s="${s}"`, en: `Precompute palindrome table: s="${s}"` });

  const hooks: PalindromePartitionHooks = {
    onPalindrome: (lo, hi) => {
      pal[lo]![hi] = true;
      palCells.add(`${lo},${hi}`);
      mode = 'pal';
      curI = lo;
      curJ = hi;
      snap({
        zh: `发现回文 s[${lo}..${hi}] = "${s.slice(lo, hi + 1)}"`,
        en: `Palindrome s[${lo}..${hi}] = "${s.slice(lo, hi + 1)}"`,
      });
    },
    onFillCell: (i, segCount, bestJ) => {
      dp[i] = segCount;
      mode = 'dp';
      curI = i;
      curJ = bestJ;
      snap({
        zh: `dp[${i}] = ${segCount}（段数，最优上一段起点 j=${bestJ}）`,
        en: `dp[${i}] = ${segCount} (segments, best j=${bestJ})`,
      });
    },
  };

  const result = palindromePartition(s, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `最少切 ${result} 刀`, en: `Minimum ${result} cut(s)` })
    .setGrid(renderDp())
    .setAux([{ label: '切刀数 / cuts', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
