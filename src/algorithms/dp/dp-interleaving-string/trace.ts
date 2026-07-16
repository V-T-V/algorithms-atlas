// =============================================================================
// 交错字符串 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isInterleave, type InterleavingHooks } from './impl.ts';

export const DEFAULT_INPUT = { s1: 'aab', s2: 'axy', s3: 'aaxaby' };

export function buildTrace(input: { s1: string; s2: string; s3: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s1, s2, s3 } = input;
  const m = s1.length;
  const n = s2.length;

  let curI = -1;
  let curJ = -1;
  let answer = false;
  const grid: Cell[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({ v: '', role: 'default' as BarRole })),
  );

  const render = (note: { zh: string; en: string }): void => {
    const display: Cell[][] = grid.map((row, ri) =>
      row.map((c, ci) => {
        let role = c.role;
        if (c.v === '') role = 'default';
        else if (ri === curI && ci === curJ) role = 'compare';
        else if (c.v === 'T') role = 'final';
        else role = 'warn';
        return { v: c.v === '' ? '·' : c.v, role };
      }),
    );
    rec
      .begin(note)
      .setGrid(display)
      .setAux([
        { label: 's1', value: s1, role: 'frontier' },
        { label: 's2', value: s2, role: 'frontier' },
        { label: 's3', value: s3, role: 'pivot' },
        { label: '当前', value: curI >= 0 ? `dp[${curI}][${curJ}]` : '—', role: 'compare' },
      ])
      .commit();
  };

  render({ zh: `s1="${s1}" s2="${s2}" s3="${s3}"`, en: `s1="${s1}" s2="${s2}" s3="${s3}"` });

  const hooks: InterleavingHooks = {
    onCell: (i, j, ok) => {
      curI = i;
      curJ = j;
      grid[i]![j] = { v: ok ? 'T' : 'F', role: 'default' };
      render({ zh: `dp[${i}][${j}] = ${ok}`, en: `dp[${i}][${j}] = ${ok}` });
    },
    onResult: (r) => {
      answer = r;
      curI = -1;
      curJ = -1;
    },
  };

  isInterleave(s1, s2, s3, hooks);

  curI = m;
  curJ = n;
  rec
    .begin({
      zh: answer ? '是交错字符串' : '不是交错字符串',
      en: answer ? 'Is interleaving' : 'Not interleaving',
    })
    .setGrid(
      grid.map((row) =>
        row.map((c) => ({
          v: c.v === '' ? '·' : c.v,
          role: (c.v === 'T' ? 'final' : c.v === 'F' ? 'warn' : 'default') as BarRole,
        })),
      ),
    )
    .setAux([{ label: '结论', value: answer ? '是' : '否', role: answer ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
