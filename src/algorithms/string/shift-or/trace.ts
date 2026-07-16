// =============================================================================
// Shift-Or 匹配 · 录制帧序列
// setArray 展示主串（字符码），pointer 标注当前读入下标 i；
// setAux 展示模式串与位状态 D（二进制，bit k=0 表示已匹配前 k 字符；与 Shift-And 对偶）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shiftOr, type ShiftOrHooks } from './impl.ts';

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

  let i = -1;
  let roleI: BarRole = 'default';
  const matches: number[] = [];

  const aux = (d: number): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'D', value: (d >>> 0).toString(2).padStart(m, '0'), role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }, d: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux(d)).commit();
    roleI = 'default';
  };

  snap(
    {
      zh: `在 text 中查找 pat="${pat}"（位并行 NFA，0 表示匹配）`,
      en: `Search pat="${pat}" (bit-parallel NFA, 0=match)`,
    },
    0xffffffff >>> 0,
  );

  const hooks: ShiftOrHooks = {
    onChar: (idx, ch, d) => {
      i = idx;
      snap(
        { zh: `读入 text[${idx}]='${ch}'，D 更新`, en: `Read text[${idx}]='${ch}', update D` },
        d,
      );
    },
    onFound: (end) => {
      const start = end - m + 1;
      matches.push(start);
      roleI = 'final';
      snap(
        {
          zh: `命中！D 最低位 = 0，起点 = ${start}`,
          en: `Found! low bit cleared, start = ${start}`,
        },
        0,
      );
    },
    onDone: () => {
      /* 终态统一渲染 */
    },
  };

  shiftOr(text, pat, hooks);

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
