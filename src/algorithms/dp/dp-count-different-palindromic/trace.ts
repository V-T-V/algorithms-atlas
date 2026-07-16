// =============================================================================
// 统计不同回文子序列 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countDifferentPalindromicSubsequences, type CountPalHooks } from './impl.ts';

export const DEFAULT_INPUT = 'bccb';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  // dp 表，初始未填
  const grid: Cell[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ v: '', role: 'default' as BarRole })),
  );
  let curI = -1;
  let curJ = -1;
  let result = 0;

  const render = (note: { zh: string; en: string }): void => {
    const display: Cell[][] = grid.map((row, ri) =>
      row.map((c, ci) => {
        let role = c.role;
        if (c.v === '') role = 'default';
        else if (ri === curI && ci === curJ) role = 'compare';
        else if (ci >= ri) role = 'frontier';
        else role = 'default';
        return { v: c.v, role };
      }),
    );
    // 列头加字符
    rec
      .begin(note)
      .setGrid(display)
      .setAux([
        { label: 's', value: input, role: 'frontier' },
        { label: '当前', value: curI >= 0 ? `dp[${curI}][${curJ}]` : '—', role: 'compare' },
        { label: '答案', value: result ? String(result) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  render({ zh: `s = "${input}"`, en: `s = "${input}"` });

  const hooks: CountPalHooks = {
    onRange: (i, j, val) => {
      curI = i;
      curJ = j;
      grid[i]![j] = { v: val, role: 'default' };
      render({ zh: `dp[${i}][${j}] = ${val}`, en: `dp[${i}][${j}] = ${val}` });
    },
    onResult: (c) => {
      result = c;
      curI = -1;
      curJ = -1;
    },
  };

  countDifferentPalindromicSubsequences(input, hooks);

  curI = 0;
  curJ = n - 1;
  rec
    .begin({
      zh: `共 ${result} 个不同回文子序列`,
      en: `${result} distinct palindromic subsequences`,
    })
    .setGrid(
      grid.map((row) =>
        row.map((c) => ({ v: c.v, role: (c.v === '' ? 'default' : 'frontier') as BarRole })),
      ),
    )
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
