// =============================================================================
// Lyndon 词 · 录制帧序列
// setArray 展示字符串（字符码），setAux 展示分解因子与最小表示。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lyndon, minRotation, type LyndonHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcabcab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const factors: Array<[number, number]> = [];
  let curI = -1;
  let curJ = -1;
  let curK = -1;
  let roleTip: BarRole = 'default';

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'factors', value: factors.map((f) => s.slice(f[0], f[1])).join(' | ') || '-' },
    { label: 'i/j/k', value: `${curI}/${curJ}/${curK}`, role: 'compare' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (curI >= 0) {
      pointers.push({ index: curI, label: 'i' });
      roles[curI] = roleTip;
    }
    if (curJ >= 0 && curJ < n) pointers.push({ index: curJ, label: 'j' });
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
    roleTip = 'default';
  };

  snap({ zh: `Lyndon 分解：${s}`, en: `Lyndon factorization: ${s}` });

  const hooks: LyndonHooks = {
    onFactor: (start, end) => {
      factors.push([start, end]);
      curI = start;
      roleTip = 'final';
      snap({ zh: `因子 '${s.slice(start, end)}'`, en: `Factor '${s.slice(start, end)}'` });
    },
    onCompare: (i, j, k) => {
      curI = i;
      curJ = j;
      curK = k;
      roleTip = 'compare';
    },
    onDone: () => {},
  };

  lyndon(s, hooks);

  const rot = minRotation(s);
  curI = -1;
  rec
    .begin({
      zh: `完成 + 最小表示起点 ${rot}：'${s.slice(rot) + s.slice(0, rot)}'`,
      en: `Done, min rot @${rot}`,
    })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();
  return rec.build();
}
