// =============================================================================
// 三串 LCS · 录制帧序列（取 k=n3 切片展示 dp[i][j]）
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcs3, type Lcs3Hooks } from './impl.ts';

export const DEFAULT_INPUT: { s1: string; s2: string; s3: string } = {
  s1: 'abcde',
  s2: 'ace',
  s3: 'abc',
};

export function buildTrace(input: { s1: string; s2: string; s3: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s1, s2, s3 } = input;
  const n1 = s1.length;
  const n2 = s2.length;
  const n3 = s3.length;
  const dp: number[][][] = Array.from({ length: n1 + 1 }, () =>
    Array.from({ length: n2 + 1 }, () => new Array<number>(n3 + 1).fill(0)),
  );
  let cur: { i: number; j: number; k: number } = { i: 0, j: 0, k: 0 };
  let eqFlash = false;

  const snap = (note: { zh: string; en: string }): void => {
    const k = n3;
    const grid: Cell[][] = [];
    for (let i = 0; i <= n1; i++) {
      const row: Cell[] = [];
      for (let j = 0; j <= n2; j++) {
        const isCur = i === cur.i && j === cur.j && k === cur.k;
        const isEq = eqFlash && i === cur.i && j === cur.j;
        row.push({
          v: String(dp[i]![j]![k]!),
          role: isEq ? 'swap' : isCur ? 'compare' : 'default',
        });
      }
      grid.push(row);
    }
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: 's1', value: s1, role: 'frontier' },
        { label: 's2', value: s2, role: 'frontier' },
        { label: 's3', value: s3, role: 'frontier' },
        {
          label: 'cell',
          value: `(${cur.i},${cur.j},${cur.k})=${dp[cur.i]?.[cur.j]?.[cur.k] ?? 0}`,
          role: 'pivot',
        },
      ])
      .commit();
  };

  snap({ zh: `三串：${s1} | ${s2} | ${s3}`, en: `Three strings: ${s1} | ${s2} | ${s3}` });

  const hooks: Lcs3Hooks = {
    onCompare: (i, j, k, eq) => {
      cur = { i, j, k };
      eqFlash = eq;
      snap({
        zh: eq ? `s1[${i - 1}]=s2[${j - 1}]=s3[${k - 1}]，匹配 +1` : `(${i},${j},${k}) 取三者最大`,
        en: eq ? `Match at (${i},${j},${k})` : `Max of three at (${i},${j},${k})`,
      });
      eqFlash = false;
    },
  };

  const ans = lcs3(s1, s2, s3, hooks);
  void dp;

  rec
    .begin({ zh: `三串 LCS 长度 = ${ans}`, en: `3-string LCS length = ${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
