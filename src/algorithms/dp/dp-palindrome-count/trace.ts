// =============================================================================
// 回文子串计数 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countPalindromeSubstrings, type PalindromeCountHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aaa';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  let curI = -1;
  let curJ = -1;
  let total = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'i\\j', role: 'default' },
      ...input.split('').map((c, j) => ({ v: `${j}:${c}`, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `${i}:${input[i]}`, role: 'pivot' as BarRole }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (j < i) role = 'default';
        else if (i === curI && j === curJ) role = 'compare';
        else if (isPal[i]![j]!) role = 'final';
        row.push({ v: j < i ? '' : isPal[i]![j]! ? '✓' : '·', role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '回文数', value: String(total), role: 'final' }])
      .commit();
  };

  snap({ zh: `字符串 "${input}"（长度 ${n}）`, en: `String "${input}" (len ${n})` });

  const hooks: PalindromeCountHooks = {
    onCheck: (i, j, pal) => {
      isPal[i]![j] = pal;
      curI = i;
      curJ = j;
      if (pal) total++;
      snap({
        zh: `s[${i}..${j}]="${input.slice(i, j + 1)}" ${pal ? '是' : '非'}回文`,
        en: `s[${i}..${j}]="${input.slice(i, j + 1)}" ${pal ? 'pal' : 'no'}`,
      });
    },
    onResult: (t) => {
      curI = -1;
      curJ = -1;
      snap({ zh: `共 ${t} 个回文子串`, en: `${t} palindromic substrings` });
    },
  };

  countPalindromeSubstrings(input, hooks);

  rec
    .begin({ zh: `完成：${total} 个`, en: `Done: ${total}` })
    .setGrid(renderGrid())
    .setAux([{ label: '总数', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
