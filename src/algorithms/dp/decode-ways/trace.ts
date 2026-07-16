// =============================================================================
// 解码方法 · 录制帧序列
// 用单行 grid（DP 表）展示：列 i = 前缀长度，单元格 v = dp[i]。
// 当前填的格标 'compare'，被引用的来源格标 'pivot'，已填区域标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { decodeWays, type DecodeWaysHooks } from './impl.ts';

export const DEFAULT_INPUT = '11106';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;

  const dp: number[] = new Array<number>(n + 1).fill(-1);
  dp[0] = 1;
  let cur = -1;
  let src1 = -1;
  let src2 = -1;
  const filled = new Set<number>();
  filled.add(0);

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i', role: 'default' }];
    for (let i = 0; i <= n; i++) header.push({ v: i, role: 'pivot' });
    const prefixRow: Cell[] = [{ v: 's[0..i)', role: 'pivot' }];
    for (let i = 0; i <= n; i++)
      prefixRow.push({ v: i === 0 ? 'ε' : s.slice(0, i), role: 'default' });
    const valueRow: Cell[] = [{ v: 'dp[i]', role: 'pivot' }];
    for (let i = 0; i <= n; i++) {
      let role: BarRole = 'default';
      if (filled.has(i)) role = 'final';
      if (src1 === i || src2 === i) role = 'pivot';
      if (cur === i) role = 'compare';
      valueRow.push({ v: dp[i]! < 0 ? '·' : dp[i]!, role });
    }
    return [header, prefixRow, valueRow];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snapshot({ zh: `数字串 "${s}"，求解码方式总数`, en: `String "${s}", count decodings` });

  const hooks: DecodeWaysHooks = {
    onFillCell: (i, val, take1, take2) => {
      dp[i] = val;
      cur = i;
      src1 = take1 ? i - 1 : -1;
      src2 = take2 ? i - 2 : -1;
      filled.add(i);
      const parts: string[] = [];
      if (take1) parts.push(`dp[${i - 1}]=${dp[i - 1]!}`);
      if (take2) parts.push(`dp[${i - 2}]=${dp[i - 2]!}`);
      snapshot({
        zh: `dp[${i}] = ${val}${parts.length ? `（${parts.join(' + ')}）` : '（无合法单/双位）'}`,
        en: `dp[${i}] = ${val}${parts.length ? ` (${parts.join(' + ')})` : ' (no valid 1/2-digit)'}`,
      });
    },
    onDone: (total) => {
      cur = -1;
      src1 = -1;
      src2 = -1;
      snapshot({ zh: `解码方式总数 = ${total}`, en: `Total decodings = ${total}` });
    },
  };

  const result = decodeWays(s, hooks);

  rec
    .begin({ zh: `结果：${result} 种`, en: `Result: ${result} way(s)` })
    .setGrid(renderGrid())
    .commit();

  return rec.build();
}
