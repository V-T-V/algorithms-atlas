// =============================================================================
// 扩展 KMP（Z 函数）· 录制帧序列
// 用 setArray 展示字符串 s（values 取字符码），pointers 标注当前 i 与匹配区间 [l,r]；
// setAux 展示 z 数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zFunction, type ExKmpHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabxaabxaaaabxaab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const z = new Array<number>(n).fill(0);
  let i = -1;
  let l = -1;
  let r = -1;

  const snapshot = (note: { zh: string; en: string }, roleI: BarRole): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (l >= 0 && r >= 0) for (let k = l; k <= r; k++) roles[k] = 'frontier';
    if (i >= 0 && i < n) roles[i] = roleI;
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    if (l >= 0) pointers.push({ index: l, label: 'l' });
    if (r >= 0) pointers.push({ index: Math.min(r, n - 1), label: 'r' });
    rec
      .begin(note)
      .setArray(CODE(input), roles, pointers)
      .setAux([
        { label: 's', value: input, role: 'default' },
        { label: 'z', value: `[${z.join(', ')}]`, role: 'default' },
        { label: 'i', value: `${i < 0 ? '-' : i}`, role: 'compare' },
      ])
      .commit();
  };

  snapshot({ zh: `计算 "${input}" 的 Z 函数`, en: `Compute Z-function of "${input}"` }, 'default');

  const hooks: ExKmpHooks = {
    onBox: (bl, br) => {
      l = bl;
      r = br;
    },
    onSetZ: (idx, value) => {
      i = idx;
      z[idx] = value;
      snapshot(
        {
          zh: `z[${idx}] = ${value}`,
          en: `z[${idx}] = ${value}`,
        },
        value > 0 ? 'compare' : 'warn',
      );
    },
  };

  zFunction(input, hooks);

  // 终态
  i = -1;
  l = -1;
  r = -1;
  rec
    .begin({ zh: `完成：z = [${z.join(', ')}]`, en: `Done: z = [${z.join(', ')}]` })
    .setArray(CODE(input), new Array(n).fill('final'), [])
    .setAux([{ label: 'z', value: `[${z.join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
