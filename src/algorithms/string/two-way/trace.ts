// =============================================================================
// 双向匹配 · 录制帧序列
// setArray 展示主串（字符码），pointer 标注窗口起点 pos 与当前比较 j；setAux 展示模式与临界点 ell。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoWay, type TwoWayHooks } from './impl.ts';

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

  snap({ zh: `双向匹配：先右半后左半，${pat}`, en: `Two-way: right half first, ${pat}` });

  const hooks: TwoWayHooks = {
    onAlign: (p) => {
      pos = p;
      snap({ zh: `窗口对齐 pos=${p}`, en: `Align pos=${p}` });
    },
    onCompare: (ti, pi, ok) => {
      j = pi;
      roleTip = ok ? 'compare' : 'warn';
      snap({
        zh: `比较 text[${ti}] 与 pat[${pi}]：${ok ? '等' : '不等'}`,
        en: `Compare text[${ti}] vs pat[${pi}]: ${ok ? 'eq' : 'ne'}`,
      });
    },
    onFound: (p) => {
      matches.push(p);
      roleTip = 'final';
      snap({ zh: `命中！pos=${p}`, en: `Found! pos=${p}` });
    },
    onShift: (from, to) => {
      pos = to;
      roleTip = 'frontier';
      snap({ zh: `滑动 ${from}→${to}`, en: `Shift ${from}->${to}` });
    },
  };

  twoWay(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const s of matches) for (let k = 0; k < m; k++) roles[s + k] = 'final';
  rec
    .begin({ zh: `完成：[${matches.join(', ')}]`, en: `Done: [${matches.join(', ')}]` })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();
  return rec.build();
}
