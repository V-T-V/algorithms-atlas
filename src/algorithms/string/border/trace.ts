// =============================================================================
// Border 数组 · 录制帧序列
// setArray 展示模式串（字符码），pointer 标注 i 与候选 len；setAux 展示 border 数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { border, type BorderHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabaabaaaab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pat = input;
  const m = pat.length;
  let i = -1;
  let curLen = 0;
  let roleI: BarRole = 'default';
  const b: number[] = new Array<number>(m).fill(0);

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'len', value: String(curLen), role: 'frontier' },
    { label: 'border', value: `[${b.join(', ')}]` },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(m).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
      if (curLen > 0 && curLen < m) pointers.push({ index: curLen, label: 'len' });
    }
    rec.begin(note).setArray(CODE(pat), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({ zh: `构造 border 数组：${pat}`, en: `Build border array: ${pat}` });

  const hooks: BorderHooks = {
    onFallback: (idx, from, to) => {
      i = idx;
      curLen = to;
      roleI = 'warn';
      snap({ zh: `len 从 ${from} 回退到 ${to}`, en: `len falls ${from} -> ${to}` });
    },
    onSet: (idx, value) => {
      b[idx] = value;
      curLen = value;
      i = idx;
      roleI = value > 0 ? 'compare' : 'default';
      snap({ zh: `border[${idx}] = ${value}`, en: `border[${idx}] = ${value}` });
    },
    onDone: () => {
      /* 终态 */
    },
  };

  border(pat, hooks);

  rec
    .begin({ zh: `完成：border = [${b.join(', ')}]`, en: `Done: border = [${b.join(', ')}]` })
    .setArray(CODE(pat), new Array(m).fill('final'), [])
    .setAux(aux())
    .commit();

  return rec.build();
}
