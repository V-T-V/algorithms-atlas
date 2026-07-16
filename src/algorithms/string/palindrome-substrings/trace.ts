// =============================================================================
// 回文子串计数 · 录制帧序列
// setArray 展示字符串（字符码），高亮当前回文区间；setAux 展示计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countSubstrings, type PalindromeSubstringsHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aaa';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let count = 0;
  let curLo = -1;
  let curHi = -1;
  let center = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (center >= 0 && center < n) {
      roles[center] = 'pivot';
      pointers.push({ index: center, label: 'center' });
    }
    if (curLo >= 0 && curHi >= 0) {
      for (let k = curLo; k <= curHi; k++) roles[k] = 'compare';
    }
    rec
      .begin(note)
      .setArray(CODE(s), roles, pointers)
      .setAux([
        { label: '已发现回文数', value: String(count), role: 'final' as BarRole },
        {
          label: '当前区间',
          value: curLo >= 0 ? `[${curLo}, ${curHi}] = '${s.slice(curLo, curHi + 1)}'` : '-',
        },
      ])
      .commit();
  };

  snap({ zh: `统计回文子串：s = ${s}`, en: `Count palindromic substrings: s = ${s}` });

  const hooks: PalindromeSubstringsHooks = {
    onCenter: (c) => {
      center = c;
      curLo = -1;
      curHi = -1;
      snap({
        zh: `新中心：下标 ${c}（${c % 2 === 0 ? '奇' : '偶'}长度中心）`,
        en: `New center: index ${c} (${c % 2 === 0 ? 'odd' : 'even'}-length center)`,
      });
    },
    onExpand: (lo, hi) => {
      count++;
      curLo = lo;
      curHi = hi;
      snap({
        zh: `发现回文 '${s.slice(lo, hi + 1)}'（[${lo}, ${hi}]）`,
        en: `Palindrome '${s.slice(lo, hi + 1)}' found ([${lo}, ${hi}])`,
      });
    },
    onExpandEnd: () => {
      /* 扩展结束，不单独成帧 */
    },
  };

  const total = countSubstrings(s, hooks);

  rec
    .begin({ zh: `完成：共 ${total} 个回文子串`, en: `Done: ${total} palindromic substrings` })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux([{ label: '总数', value: String(total), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
