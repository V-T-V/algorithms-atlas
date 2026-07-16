// =============================================================================
// Z 算法 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注 i、Z-box；setAux 展示 z 数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zAlgorithm, type ZAlgorithmHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabxaabxcaabxaabxay';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  let i = -1;
  let L = 0;
  let R = 0;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' as BarRole },
    { label: 'Z-box', value: `[${L}, ${R}]`, role: 'frontier' as BarRole },
    { label: 'z', value: `[${z.join(', ')}]` },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    // 高亮 Z-box
    for (let k = L; k <= R && k < n; k++) roles[k] = 'frontier';
    // 高亮当前匹配前缀 [i, i+z[i])
    if (i >= 0 && z[i]! > 0) {
      for (let k = i; k < i + z[i]! && k < n; k++) roles[k] = 'compare';
    }
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
  };

  snap({ zh: `计算 Z 数组：s = ${s}`, en: `Compute Z array: s = ${s}` });

  const hooks: ZAlgorithmHooks = {
    onZBox: (nl, nr) => {
      L = nl;
      R = nr;
    },
    onSet: (idx, value) => {
      z[idx] = value;
      i = idx;
      snap({
        zh: `z[${idx}] = ${value}`,
        en: `z[${idx}] = ${value}`,
      });
    },
    onExtend: () => {
      /* 扩展不单独成帧 */
    },
  };

  zAlgorithm(s, hooks);

  // 终态
  rec
    .begin({ zh: `完成：z = [${z.join(', ')}]`, en: `Done: z = [${z.join(', ')}]` })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();

  return rec.build();
}
