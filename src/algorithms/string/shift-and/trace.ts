// =============================================================================
// Shift-And 匹配 · 录制帧序列
// setArray 展示主串（字符码），pointer 标注当前读入下标 i；
// setAux 展示模式串与位状态 state（二进制，bit k=1 表示已匹配前 k 字符）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shiftAnd, type ShiftAndHooks } from './impl.ts';

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

  const aux = (state: number): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text },
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'state', value: state.toString(2).padStart(m, '0'), role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }, state: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux(state)).commit();
    roleI = 'default';
  };

  snap(
    {
      zh: `在 text 中查找 pat="${pat}"（位并行 NFA）`,
      en: `Search pat="${pat}" (bit-parallel NFA)`,
    },
    0,
  );

  const hooks: ShiftAndHooks = {
    onChar: (idx, ch, state) => {
      i = idx;
      snap(
        {
          zh: `读入 text[${idx}]='${ch}'，state 更新`,
          en: `Read text[${idx}]='${ch}', update state`,
        },
        state,
      );
    },
    onFound: (end) => {
      const start = end - m + 1;
      matches.push(start);
      roleI = 'final';
      snap(
        {
          zh: `命中！state 最高位 = 1，起点 = ${start}`,
          en: `Found! top bit set, start = ${start}`,
        },
        0,
      );
    },
    onDone: () => {
      /* 终态在下方统一渲染 */
    },
  };

  shiftAnd(text, pat, hooks);

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
