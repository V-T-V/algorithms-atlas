// =============================================================================
// KMP（next 变体）· 录制帧序列
// 用 setArray 展示主串，pointers 标注 i 与模式对齐起点；setAux 展示 next 数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kmp2, type Kmp2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'ABABDABACDABABCABAB',
  pat: 'ABABCABAB',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;
  const next: number[] = new Array(m).fill(0);
  let i = -1;
  let j = -1;
  const matches: number[] = [];
  let roleI: BarRole = 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (i >= 0 && i < n) roles[i] = roleI;
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    if (i >= 0 && j >= 0) {
      const start = i - j;
      if (start >= 0 && start < n) pointers.push({ index: start, label: 'pat0' });
    }
    rec
      .begin(note)
      .setArray(CODE(text), roles, pointers)
      .setAux([
        { label: 'text', value: text, role: 'default' },
        { label: 'pat', value: pat, role: 'default' },
        { label: 'next', value: `[${next.join(', ')}]`, role: 'default' },
        { label: 'i / j', value: `${i < 0 ? '-' : i} / ${j < 0 ? '-' : j}`, role: 'compare' },
      ])
      .commit();
    roleI = 'default';
  };

  snapshot({ zh: `在 text 中查找 pat="${pat}"`, en: `Search pat="${pat}" in text` });

  const hooks: Kmp2Hooks = {
    onSetNext: (idx, value) => {
      next[idx] = value;
    },
    onCompare: (ci, cj, equal) => {
      i = ci;
      j = cj;
      roleI = equal ? 'compare' : 'warn';
      snapshot({
        zh: equal ? `相等：text[${ci}] = pat[${cj}]` : `失配：text[${ci}] ≠ pat[${cj}]`,
        en: equal ? `Equal: text[${ci}] = pat[${cj}]` : `Mismatch: text[${ci}] ≠ pat[${cj}]`,
      });
    },
    onJump: (ci, fromJ, toJ) => {
      i = ci;
      j = toJ;
      roleI = 'frontier';
      snapshot({
        zh: `用 next 把 j 从 ${fromJ} 回跳到 ${toJ}`,
        en: `Use next to jump j from ${fromJ} to ${toJ}`,
      });
    },
    onFound: (start) => {
      matches.push(start);
      i = start + m - 1;
      roleI = 'final';
      snapshot({ zh: `命中！起点 = ${start}`, en: `Found! start = ${start}` });
    },
  };

  kmp2(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const start of matches) for (let k = 0; k < m; k++) roles[start + k] = 'final';
  rec
    .begin({ zh: `完成：${matches.length} 处匹配`, en: `Done: ${matches.length} matches` })
    .setArray(CODE(text), roles, [])
    .setAux([{ label: 'matches', value: `[${matches.join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
