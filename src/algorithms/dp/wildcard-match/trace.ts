// =============================================================================
// 通配符匹配 · 录制帧序列
// 用 grid 展示 dp 表：行 s 字符，列 p 字符。当前格 'compare'，true 格 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wildcardMatch, type WildcardMatchHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string; p: string } = { s: 'aa', p: '*' };

/** 录制演示帧序列。 */
export function buildTrace(input: { s: string; p: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, p } = input;
  const m = s.length;
  const n = p.length;

  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  let curI = -1;
  let curJ = -1;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 's\\p', role: 'default' }];
    header.push({ v: 'ε', role: 'pivot' });
    for (let j = 0; j < n; j++) header.push({ v: p[j]!, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i <= m; i++) {
      const row: Cell[] = [{ v: i === 0 ? 'ε' : s[i - 1]!, role: 'pivot' }];
      for (let j = 0; j <= n; j++) {
        let role: BarRole = 'default';
        if (dp[i]![j]!) role = 'final';
        if (curI === i && curJ === j) role = 'compare';
        row.push({ v: dp[i]![j]! ? 'T' : 'F', role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: 's', value: `"${s}"`, role: 'default' },
        { label: 'p', value: `"${p}"`, role: 'default' },
      ])
      .commit();
  };

  snap({ zh: `匹配 s="${s}" 与模式 p="${p}"`, en: `Match s="${s}" against p="${p}"` });

  const hooks: WildcardMatchHooks = {
    onFillCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({
        zh: `dp[${i}][${j}] = ${val ? 'T' : 'F'}`,
        en: `dp[${i}][${j}] = ${val ? 'T' : 'F'}`,
      });
    },
  };

  const result = wildcardMatch(s, p, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({
      zh: `结果：${result ? '匹配' : '不匹配'}`,
      en: `Result: ${result ? 'match' : 'no match'}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '结果 / result', value: result ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
