// =============================================================================
// Rabin-Karp 匹配 · 录制帧序列
// 用 setArray 展示主串（values 取字符码），pointers 标注 窗口起点 s 与当前窗口；
// setAux 展示模式串、模式哈希、窗口哈希与匹配结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarp, type RabinKarpHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'GEEKS FOR GEEKS',
  pat: 'GEEK',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  let start = -1; // 当前窗口起点
  let hashPat = -1;
  let hashWin = -1;
  const matches: number[] = [];

  const textAux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text, role: 'default' },
    { label: 'pat', value: pat, role: 'default' },
    {
      label: 'hashPat',
      value: hashPat < 0 ? '-' : String(hashPat),
      role: 'pivot',
    },
    {
      label: 'hashWin',
      value: hashWin < 0 ? '-' : String(hashWin),
      role: hashWin === hashPat && hashPat >= 0 ? 'compare' : 'default',
    },
    {
      label: 'window',
      value: start < 0 ? '-' : `[${start}, ${start + m - 1}]`,
      role: 'frontier',
    },
  ];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (start >= 0) {
      // 高亮当前窗口
      for (let k = start; k < start + m && k < n; k++) roles[k] = 'frontier';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (start >= 0) pointers.push({ index: start, label: 's' });
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(textAux()).commit();
  };

  snapshot({ zh: `在 text 中查找 pat="${pat}"`, en: `Search pat="${pat}" in text` });

  const hooks: RabinKarpHooks = {
    onPatHash: (h) => {
      hashPat = h;
    },
    onInitWindow: (s, h) => {
      start = s;
      hashWin = h;
      snapshot({
        zh: `首个窗口 [${s}, ${s + m - 1}] 的哈希 = ${h}`,
        en: `First window [${s}, ${s + m - 1}] hash = ${h}`,
      });
    },
    onRoll: (s, h) => {
      start = s;
      hashWin = h;
      snapshot({
        zh: `滚动到起点 ${s}，新窗口哈希 = ${h}（与 hashPat${h === hashPat ? ' 相等 ✅' : ' 不等'}）`,
        en: `Roll to start ${s}, new hash = ${h} (${h === hashPat ? 'match' : 'no match'})`,
      });
    },
    onVerify: (s, equal) => {
      start = s;
      const roles: BarRole[] = new Array(n).fill('default');
      for (let k = s; k < s + m && k < n; k++) roles[k] = 'compare';
      rec
        .begin({
          zh: equal
            ? `哈希相等 → 逐字校验通过 ✅ 起点 ${s} 命中`
            : `哈希碰撞！逐字校验失败 ❌ 起点 ${s}`,
          en: equal
            ? `Hash match → verified ✅ start ${s}`
            : `Hash collision! verification failed ❌ start ${s}`,
        })
        .setArray(CODE(text), roles, [{ index: s, label: 's' }])
        .setAux(textAux())
        .commit();
    },
    onFound: (s) => {
      matches.push(s);
      const roles: BarRole[] = new Array(n).fill('default');
      for (let k = s; k < s + m && k < n; k++) roles[k] = 'final';
      rec
        .begin({
          zh: `命中！匹配起点 = ${s}`,
          en: `Found! match start = ${s}`,
        })
        .setArray(CODE(text), roles, [{ index: s, label: '✓' }])
        .setAux(textAux())
        .commit();
    },
  };

  rabinKarp(text, pat, hooks);

  // 终态：高亮所有匹配区间
  const roles: BarRole[] = new Array(n).fill('default');
  for (const s of matches) for (let k = 0; k < m; k++) roles[s + k] = 'final';
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配，起点 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} matches, starts [${matches.join(', ')}]`,
    })
    .setArray(CODE(text), roles, [])
    .setAux([{ label: 'matches', value: `[${matches.join(', ')}]`, role: 'final' }, ...textAux()])
    .commit();

  return rec.build();
}
