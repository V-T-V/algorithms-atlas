// =============================================================================
// 后缀数组 · 录制帧序列
// 用 setArray 展示 SA 数组（值为后缀起点，pointers 标当前轮参与比较的对），用
// setAux 展示 rank 数组与各后缀串。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { suffixArray, type SuffixArrayHooks } from './impl.ts';

export const DEFAULT_INPUT = { s: 'banana' };

/** 录制演示帧序列。 */
export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input.s;

  // 当前 sa / rank / 倍增长度
  let sa: number[] = [];
  let rank: number[] = [];
  let curLen = 1;

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const suffixes = sa.map((start, r) => {
      const suf = s.slice(start);
      return `[${r}]=${suf}（rank=${rank[start]}）`;
    });
    return [
      { label: '字符串', value: s, role: 'default' },
      { label: '倍增长度', value: String(curLen), role: 'frontier' },
      {
        label: 'SA',
        value: `[${sa.join(', ')}]`,
        role: 'compare',
      },
      {
        label: 'rank',
        value: `[${rank.join(', ')}]`,
        role: 'default',
      },
      { label: '后缀列表', value: suffixes.join('  |  '), role: 'default' },
    ];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(sa, new Array(sa.length).fill('default'), [])
      .setAux(auxRows())
      .commit();
  };

  snapshot({ zh: `构造 "${s}" 的后缀数组（倍增法）`, en: `Build SA of "${s}" (doubling)` });

  const hooks: SuffixArrayHooks = {
    onRound: (_k, len) => {
      curLen = len;
    },
    onSort: (curSa, curRank) => {
      sa = curSa;
      rank = curRank;
      snapshot({
        zh: `比较长度 ${curLen} 的前缀排序后：SA = [${sa.join(', ')}]`,
        en: `After sorting by length-${curLen} prefix: SA = [${sa.join(', ')}]`,
      });
    },
    onDone: (finalSa, finalRank) => {
      sa = finalSa;
      rank = finalRank;
    },
  };

  suffixArray(s, hooks);

  // 终态：高亮有序的后缀
  rec
    .begin({
      zh: `完成：SA = [${sa.join(', ')}]（后缀已按字典序排好）`,
      en: `Done: SA = [${sa.join(', ')}] (suffixes sorted)`,
    })
    .setArray(sa, new Array(sa.length).fill('final'), [])
    .setAux([
      {
        label: '排序后的后缀',
        value: sa.map((start) => s.slice(start)).join('  |  '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
