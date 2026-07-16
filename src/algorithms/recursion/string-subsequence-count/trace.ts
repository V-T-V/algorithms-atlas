// 递归统计子序列出现次数 · 录制帧序列
// 用 setGrid 展示记忆化表 memo[i][j]。

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countSubsequence, type SubseqHooks } from './impl.ts';

export const DEFAULT_INPUT = { s: 'rabbbit', t: 'rabbit' };

export function buildTrace(input: { s: string; t: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, t } = input;
  const m = s.length;
  const n = t.length;
  const memo: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(-1));
  let curI = -1;
  let curJ = -1;
  let curMatch = false;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'i\\j', role: 'default' },
      ...t.split('').map((c) => ({ v: c, role: 'pivot' as BarRole })),
      { v: '∅', role: 'pivot' as BarRole },
    ];
    const grid: Cell[][] = [header];
    for (let i = 0; i <= m; i++) {
      const rowLabel = i === 0 ? '∅' : s[i - 1]!;
      const row: Cell[] = [{ v: rowLabel, role: 'pivot' as BarRole }];
      for (let j = 1; j <= n; j++) {
        const v = memo[i]![j]!;
        let role: BarRole = 'default';
        if (v >= 0) role = 'frontier';
        if (i === curI && j === curJ) role = curMatch ? 'final' : 'compare';
        row.push({ v: v >= 0 ? v : '.', role });
      }
      // j=0 列（空模式，恒为 1）
      let role0: BarRole = 'sorted';
      if (i === curI && 0 === curJ) role0 = 'compare';
      row.push({ v: 1, role: role0 });
      grid.push(row);
    }
    return grid;
  };

  rec
    .begin({ zh: `s="${s}", t="${t}"`, en: `s="${s}", t="${t}"` })
    .setGrid(renderGrid())
    .setAux([
      { label: '说明', value: 'memo[i][j] = s前i中 t前j 的子序列数', role: 'frontier' as BarRole },
    ])
    .commit();

  const hooks: SubseqHooks = {
    onCompute: (i, j, hit) => {
      curI = i;
      curJ = j;
      curMatch = false;
      if (hit) {
        rec
          .begin({
            zh: `命中缓存 (${i},${j})=${memo[i]![j]!}`,
            en: `Cache hit (${i},${j})=${memo[i]![j]!}`,
          })
          .setGrid(renderGrid())
          .commit();
      }
    },
    onMatch: (i, j, sc, tc) => {
      curI = i;
      curJ = j;
      curMatch = true;
      rec
        .begin({
          zh: `匹配 s[${i - 1}]='${sc}' == t[${j - 1}]='${tc}'`,
          en: `Match s[${i - 1}]='${sc}' == t[${j - 1}]='${tc}'`,
        })
        .setGrid(renderGrid())
        .commit();
    },
  };

  const result = countSubsequence(s, t, hooks);
  // 填满 memo 用于终态显示
  countSubsequence(s, t);

  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setGrid(renderGrid())
    .setAux([
      { label: '出现次数', value: String(result), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(|s|·|t|)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
