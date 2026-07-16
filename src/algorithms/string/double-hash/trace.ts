// =============================================================================
// 双哈希 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注当前 i；setAux 展示两套哈希 prefix1/prefix2。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { doubleHash, type DoubleHashHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abababab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let i = -1;
  let roleI: BarRole = 'default';

  const aux = (h1: number, h2: number): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'h1 (mod 1e9+7)', value: i < 0 ? '-' : String(h1), role: 'frontier' },
    { label: 'h2 (mod 998M)', value: i < 0 ? '-' : String(h2), role: 'frontier' },
  ];

  const snap = (note: { zh: string; en: string }, h1: number, h2: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux(h1, h2)).commit();
    roleI = 'default';
  };

  snap({ zh: `双模数哈希：${s}`, en: `Double-modulus hash: ${s}` }, 0, 0);

  const hooks: DoubleHashHooks = {
    onStep: (idx, h1, h2) => {
      i = idx;
      snap({ zh: `位置 ${idx}：h1=${h1}, h2=${h2}`, en: `pos ${idx}: h1=${h1}, h2=${h2}` }, h1, h2);
    },
    onDone: () => {
      /* 终态 */
    },
  };

  doubleHash(s, hooks);

  i = -1;
  rec
    .begin({ zh: '完成：两套独立哈希已构造', en: 'Done: two independent hashes built' })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux(0, 0))
    .commit();

  return rec.build();
}
