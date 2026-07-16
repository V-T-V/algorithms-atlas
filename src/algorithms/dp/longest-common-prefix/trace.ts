// =============================================================================
// 最长公共前缀 LCP Array · 录制帧序列
// 上半部分 setGrid 展示后缀数组 SA（每行一个排序后的后缀）；
// 下半部分 setAux 展示 LCP 数组。当前处理后缀 'compare'，最大 LCP 处 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSuffixArray, longestCommonPrefix, type LcpArrayHooks } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const sa = buildSuffixArray(s);

  const lcp: number[] = new Array<number>(n).fill(-1);
  let curRank = -1;
  let maxLcp = 0;

  /** grid：行 = 排序后的后缀，列展示「rank | 起点idx | 后缀串 | lcp」。 */
  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: 'rank', role: 'pivot' },
      { v: 'idx', role: 'pivot' },
      { v: 'suffix', role: 'pivot' },
      { v: 'lcp', role: 'pivot' },
    ];
    const rows: Cell[][] = [header];
    for (let k = 0; k < n; k++) {
      const idx = sa[k]!;
      let role: BarRole = 'default';
      if (k === curRank) role = 'compare';
      else if (lcp[k]! === maxLcp && maxLcp > 0) role = 'final';
      rows.push([
        { v: k, role: 'pivot' },
        { v: idx, role },
        { v: s.slice(idx), role },
        { v: lcp[k]! < 0 ? '·' : lcp[k]!, role },
      ]);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `串 "${s}"，后缀数组已排序`, en: `String "${s}", suffix array sorted` });

  const hooks: LcpArrayHooks = {
    onVisit: (i, rank) => {
      curRank = rank;
    },
    onFillCell: (rank, h) => {
      lcp[rank] = h;
      if (h > maxLcp) maxLcp = h;
      snap({
        zh: `lcp[rank=${rank}] = ${h}（后缀 "${s.slice(sa[rank - 1]!)}" 与 "${s.slice(sa[rank]!)}" 的 LCP）`,
        en: `lcp[rank=${rank}] = ${h} (LCP of "${s.slice(sa[rank - 1]!)}" and "${s.slice(sa[rank]!)}")`,
      });
    },
  };

  const result = longestCommonPrefix(s, sa, hooks);

  curRank = -1;
  rec
    .begin({
      zh: `LCP 数组：[${result.join(', ')}]，最长 = ${maxLcp}`,
      en: `LCP array: [${result.join(', ')}], max = ${maxLcp}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '最长 LCP / max', value: String(maxLcp), role: 'final' }])
    .commit();

  return rec.build();
}
