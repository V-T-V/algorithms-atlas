// =============================================================================
// KMP 完整版 · 录制帧序列
// setArray 展示文本（字符码），pointer 标注 i、j；setAux 展示 π 数组与匹配。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kmpSearch, type KMPHooks } from './impl.ts';

export const DEFAULT_INPUT = { txt: 'ababcababacabab', pat: 'ababac' };

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

export function buildTrace(input: { txt: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { txt, pat } = input;
  const n = txt.length;
  const m = pat.length;
  const pi = new Array<number>(m).fill(0);

  let i = -1;
  let j = 0;
  let roleI: BarRole = 'default';
  let roleJ: BarRole = 'default';
  const matches: number[] = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'txt', value: txt },
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' as BarRole },
    { label: 'j', value: String(j), role: 'frontier' as BarRole },
    { label: 'π', value: `[${pi.join(', ')}]` },
    { label: 'matches', value: `[${matches.join(', ')}]`, role: 'final' as BarRole },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    // 高亮已匹配区间 [i-j+1, i]
    if (i >= 0 && j > 0) {
      for (let k = Math.max(0, i - j + 1); k <= i; k++) roles[k] = 'frontier';
    }
    if (i >= 0) {
      roles[i] = roleI;
      pointers.push({ index: i, label: 'i' });
    }
    rec.begin(note).setArray(CODE(txt), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
    roleJ = 'default';
    void roleJ;
  };

  // π 构造阶段帧
  snap({
    zh: `构造 π 后开始匹配：pat = ${pat}`,
    en: `After building π, start matching: pat = ${pat}`,
  });

  const hooks: KMPHooks = {
    onPiSet: (idx, value) => {
      pi[idx] = value;
    },
    onPiFallback: () => {
      /* π 构造回退不单独成帧 */
    },
    onMatchCompare: (idx, jj, equal) => {
      i = idx;
      j = jj;
      roleI = equal ? 'compare' : 'warn';
    },
    onMatchFallback: (idx, fromJ, toJ) => {
      i = idx;
      j = toJ;
      roleI = 'warn';
      snap({
        zh: `失配：j 从 ${fromJ} 回退到 ${toJ}（按 π）`,
        en: `Mismatch: j falls ${fromJ} → ${toJ} (by π)`,
      });
    },
    onMatch: (start) => {
      matches.push(start);
      snap({
        zh: `命中匹配，起点 = ${start}`,
        en: `Match found, start = ${start}`,
      });
    },
  };

  // 在每次 compare 后成帧：用包装
  const wrappedHooks: KMPHooks = {
    onPiSet: hooks.onPiSet,
    onPiFallback: hooks.onPiFallback,
    onMatchCompare: (idx, jj, equal) => {
      hooks.onMatchCompare?.(idx, jj, equal);
      i = idx;
      j = jj;
      roleI = equal ? 'compare' : 'warn';
      snap({
        zh: `比较 txt[${idx}]='${txt[idx]}' 与 pat[${jj}]（${equal ? '相等' : '不等'}）`,
        en: `Compare txt[${idx}]='${txt[idx]}' with pat[${jj}] (${equal ? 'equal' : '≠'})`,
      });
    },
    onMatchFallback: hooks.onMatchFallback,
    onMatch: hooks.onMatch,
  };

  kmpSearch(txt, pat, wrappedHooks);

  // 终态
  const roles: BarRole[] = new Array(n).fill('default');
  for (const s of matches) {
    for (let k = s; k < s + m; k++) roles[k] = 'final';
  }
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配，起点 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} match(es) at [${matches.join(', ')}]`,
    })
    .setArray(CODE(txt), roles, [])
    .setAux(aux())
    .commit();

  return rec.build();
}
