// =============================================================================
// BNDM（位并行反向匹配）· 录制帧序列
// setArray 展示主串（字符码），pointers 标注窗口起点 pos 与反向扫描指针 i；
// setAux 展示模式串与位状态 d（二进制）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bndm, type BndmHooks } from './impl.ts';

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
  let scanI = -1;
  let roleTip: BarRole = 'default';
  const matches: number[] = [];

  const aux = (d: number): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 'pos', value: pos < 0 ? '-' : String(pos), role: 'frontier' },
    { label: 'i', value: scanI < 0 ? '-' : String(scanI), role: 'compare' },
    { label: 'd(bin)', value: d.toString(2).padStart(m, '0'), role: 'compare' },
  ];

  const snap = (note: { zh: string; en: string }, d: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos >= 0) {
      pointers.push({ index: pos, label: 'pos' });
      if (scanI >= 0 && pos + scanI < n) {
        pointers.push({ index: pos + scanI, label: 'i' });
        roles[pos + scanI] = roleTip;
      }
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux(d)).commit();
    roleTip = 'default';
  };

  snap(
    {
      zh: `在 text 中查找 pat="${pat}"（从右向左位并行）`,
      en: `Search pat="${pat}" (bit-parallel, right-to-left)`,
    },
    0,
  );

  const hooks: BndmHooks = {
    onAlign: (p) => {
      pos = p;
      scanI = m - 1;
      snap(
        {
          zh: `窗口对齐到 pos=${p}，从 i=${m - 1} 反向扫描`,
          en: `Align window at pos=${p}, scan from i=${m - 1}`,
        },
        0,
      );
    },
    onScan: (p, i, d) => {
      pos = p;
      scanI = i;
      snap(
        { zh: `读入 text[${p + i}]，更新位状态 d`, en: `Read text[${p + i}], update state d` },
        d,
      );
    },
    onFound: (start) => {
      matches.push(start);
      roleTip = 'final';
      snap({ zh: `命中！起点 = ${start}`, en: `Found! start = ${start}` }, 0);
    },
    onShift: (from, to, step) => {
      pos = to;
      scanI = -1;
      roleTip = 'frontier';
      snap(
        {
          zh: `按最长前缀滑动 ${step} 位，pos 从 ${from} 到 ${to}`,
          en: `Shift ${step}, pos ${from} -> ${to}`,
        },
        0,
      );
    },
  };

  bndm(text, pat, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  for (const s of matches) for (let k = 0; k < m; k++) roles[s + k] = 'final';
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} matches [${matches.join(', ')}]`,
    })
    .setArray(CODE(text), roles, [])
    .setAux(aux(0))
    .commit();

  return rec.build();
}
