// =============================================================================
// 高维前缀和DP · 录制帧序列
// 用 setBars 展示 f[mask]（下标 = 掩码），用 setAux 展示当前处理的位 i。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sosDp, type SosDpHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6]; // 2^3 = 8 个掩码的权值

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const size = input.length;
  if (size === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }
  const n = Math.log2(size);
  const f = [...input];
  let curBit = -1;
  const updated = new Set<number>();
  let curMask: number | null = null;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    updated.forEach((m) => {
      roles[m] = 'frontier';
    });
    if (curMask !== null) roles[curMask] = 'compare';
    const labels: Record<number, string> = {};
    for (let m = 0; m < size; m++) labels[m] = `m=${m.toString(2).padStart(n, '0')}`;
    return rec.barsFrom(f, roles, labels);
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(renderBars())
      .setAux([{ label: '当前位 i', value: curBit >= 0 ? String(curBit) : '-', role: 'pivot' }])
      .commit();
  };

  snapshot({ zh: `${size} 个掩码的权值（n=${n} 位）`, en: `${size} masks (n=${n} bits)` });

  const hooks: SosDpHooks = {
    onBit: (i) => {
      curBit = i;
      updated.clear();
      snapshot({ zh: `处理第 ${i} 位`, en: `Process bit ${i}` });
    },
    onMerge: (mask, from) => {
      curMask = mask;
      void from;
    },
    onUpdate: (mask, val) => {
      f[mask] = val;
      updated.add(mask);
    },
  };

  const result = sosDp(input, hooks);
  void result;

  curMask = null;
  curBit = -1;
  rec
    .begin({
      zh: `完成；各掩码的子集和 = [${f.join(', ')}]`,
      en: `Done; subset sums = [${f.join(', ')}]`,
    })
    .setBars(f.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
