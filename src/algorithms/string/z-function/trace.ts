// =============================================================================
// Z 函数 · 录制帧序列
// 用 setArray 展示主串（values 取字符码），pointers 标注 当前位置 i 与 Z-box；
// setAux 展示 Z 数组与 [l, r]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zFunction, type ZFunctionHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabxaabxcaabxaabxay';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;

  const z: number[] = new Array<number>(n).fill(0);
  let i = 0; // 当前计算的位置
  let l = 0; // Z-box 左端
  let r = 0; // Z-box 右端
  let cmpAt = -1; // 正在比较的位置（用于高亮）

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    {
      label: 'z',
      value: `[${z.join(', ')}]`,
      role: 'default',
    },
    {
      label: '[l, r]',
      value: `[${l}, ${r}]`,
      role: 'frontier',
    },
    {
      label: 'i',
      value: String(i),
      role: 'compare',
    },
  ];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    // Z-box 范围
    if (r >= l && r > 0) {
      for (let k = l; k <= r && k < n; k++) roles[k] = 'frontier';
    }
    if (i >= 0 && i < n) roles[i] = 'pivot';
    if (cmpAt >= 0 && cmpAt < n) roles[cmpAt] = 'compare';
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    if (l > 0) pointers.push({ index: l, label: 'l' });
    if (r > 0) pointers.push({ index: r, label: 'r' });
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
    cmpAt = -1;
  };

  snapshot({ zh: `对串 "${s}" 求 Z 函数`, en: `Compute Z-function of "${s}"` });

  const hooks: ZFunctionHooks = {
    onBox: (nl, nr) => {
      l = nl;
      r = nr;
    },
    onCompare: (pos, prefixIdx, equal) => {
      i = pos;
      cmpAt = pos;
      // 标出对应的前缀位置（用于理解 z 复用）
      const roles: BarRole[] = new Array(n).fill('default');
      if (r >= l && r > 0) for (let k = l; k <= r && k < n; k++) roles[k] = 'frontier';
      if (i >= 0 && i < n) roles[i] = 'compare';
      if (prefixIdx >= 0 && prefixIdx < n) roles[prefixIdx] = 'pivot';
      const pointers: Array<{ index: number; label: string }> = [
        { index: i, label: 'i' },
        { index: prefixIdx, label: 'pre' },
      ];
      rec
        .begin({
          zh: equal
            ? `s[${pos}]=s[${prefixIdx}]='${s[prefixIdx]}'，扩展 z[${pos - prefixIdx}]`
            : `s[${pos}] ≠ s[${prefixIdx}]，停止扩展`,
          en: equal
            ? `s[${pos}]=s[${prefixIdx}]='${s[prefixIdx]}', extend z[${pos - prefixIdx}]`
            : `s[${pos}] ≠ s[${prefixIdx}], stop extending`,
        })
        .setArray(CODE(s), roles, pointers)
        .setAux(aux())
        .commit();
    },
    onSetZ: (idx, value) => {
      z[idx] = value;
      i = idx;
      cmpAt = -1;
      snapshot({
        zh: `确定 z[${idx}] = ${value}`,
        en: `Set z[${idx}] = ${value}`,
      });
    },
  };

  zFunction(s, hooks);

  // 终态
  const roles: BarRole[] = new Array(n).fill('default');
  for (let k = 1; k < n; k++) if (z[k]! > 0) roles[k] = 'final';
  rec
    .begin({
      zh: `完成：Z = [${z.join(', ')}]`,
      en: `Done: Z = [${z.join(', ')}]`,
    })
    .setArray(CODE(s), roles, [])
    .setAux([{ label: 'z', value: `[${z.join(', ')}]`, role: 'final' }, ...aux()])
    .commit();

  return rec.build();
}
