// =============================================================================
// Sunday 匹配 · 录制帧序列
// setArray 展示主串（字符码），pointers 标注窗口起点 pos 与当前比较 j；
// setAux 展示模式串与「窗口后一字符」查询。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sunday, type SundayHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'AABAACAADAABAABA',
  pat: 'AABA',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  let pos = -1;
  let j = -1;
  let roleTip: BarRole = 'default';
  const matches: number[] = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 'pos', value: pos < 0 ? '-' : String(pos), role: 'frontier' },
    { label: 'j', value: j < 0 ? '-' : String(j), role: 'compare' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos >= 0) {
      pointers.push({ index: pos, label: 'pos' });
      if (j >= 0 && pos + j < n) {
        pointers.push({ index: pos + j, label: 'j' });
        roles[pos + j] = roleTip;
      }
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux()).commit();
    roleTip = 'default';
  };

  snap({ zh: `在 text 中查找 pat="${pat}"`, en: `Search pat="${pat}" in text` });

  const hooks: SundayHooks = {
    onAlign: (p) => {
      pos = p;
      snap({ zh: `窗口对齐到 pos=${p}`, en: `Align window at pos=${p}` });
    },
    onCompare: (pj, ti, eq) => {
      j = pj;
      roleTip = eq ? 'compare' : 'warn';
      snap({
        zh: `比较 text[${ti}]='${text[ti]}' 与 pat[${pj}]='${pat[pj]}'：${eq ? '相等' : '不等'}`,
        en: `Compare text[${ti}]='${text[ti]}' vs pat[${pj}]='${pat[pj]}': ${eq ? 'equal' : 'differ'}`,
      });
    },
    onShift: (from, to, nextChar) => {
      pos = to;
      roleTip = 'frontier';
      snap({
        zh: `按窗口后字符 '${nextChar}' 查表，pos 从 ${from} 滑到 ${to}`,
        en: `By next char '${nextChar}', pos shifts ${from} -> ${to}`,
      });
    },
    onFound: (start) => {
      matches.push(start);
      roleTip = 'final';
      j = 0;
      snap({ zh: `命中！起点 = ${start}`, en: `Found! start = ${start}` });
    },
  };

  sunday(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const s of matches) for (let k = 0; k < m; k++) roles[s + k] = 'final';
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} matches [${matches.join(', ')}]`,
    })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();

  return rec.build();
}
