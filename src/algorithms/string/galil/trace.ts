// =============================================================================
// Galil 匹配（KMP + 周期优化）· 录制帧序列
// setArray 展示主串（字符码），pointer 标注文本指针 i 与模式对齐起点；setAux 展示模式/周期。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { galil, type GalilHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = { text: 'abababab', pat: 'abab' };

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;
  let s = -1;
  let j = -1;
  let roleTip: BarRole = 'default';
  const matches: number[] = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 's', value: s < 0 ? '-' : String(s), role: 'frontier' },
    { label: 'j', value: j < 0 ? '-' : String(j), role: 'compare' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (s >= 0) {
      pointers.push({ index: s, label: 's' });
      if (j >= 0 && s + j < n) {
        pointers.push({ index: s + j, label: 'j' });
        roles[s + j] = roleTip;
      }
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux()).commit();
    roleTip = 'default';
  };

  snap({ zh: `Galil 匹配（周期优化）：${pat}`, en: `Galil match: ${pat}` });

  const hooks: GalilHooks = {
    onAlign: (p) => {
      s = p;
      snap({ zh: `窗口对齐 s=${p}`, en: `Align s=${p}` });
    },
    onCompare: (p, pj, ok) => {
      s = p;
      j = pj;
      roleTip = ok ? 'compare' : 'warn';
      snap({ zh: `比较：${ok ? '等' : '不等'}`, en: `Compare: ${ok ? 'eq' : 'ne'}` });
    },
    onFound: (p) => {
      matches.push(p);
      roleTip = 'final';
      snap({ zh: `命中 s=${p}`, en: `Found s=${p}` });
    },
    onShift: (p, fromJ, toJ) => {
      s = p;
      j = toJ;
      roleTip = 'frontier';
      snap({ zh: `j 从 ${fromJ}→${toJ}`, en: `j ${fromJ}->${toJ}` });
    },
  };

  galil(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const st of matches) for (let k = 0; k < m; k++) roles[st + k] = 'final';
  rec
    .begin({ zh: `完成：[${matches.join(', ')}]`, en: `Done: [${matches.join(', ')}]` })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();
  return rec.build();
}
