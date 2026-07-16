// =============================================================================
// LIS 二分 · 录制帧序列
// 用 setBars 展示原数组（选中元素标 pivot），用 setAux 展示 tails 表。
// 当前处理的元素标 'compare'，被覆盖位置标 'swap'，最终 LIS 标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lisNlog, type LisNlogHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 9, 2, 5, 3, 7, 101, 18];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = input;
  const n = a.length;

  const tails: number[] = [];
  let curI = -1;
  let curPos = -1;
  const lisSet = new Set<number>(); // 属于最终 LIS 的下标
  const placed = new Set<number>(); // 已处理元素

  const auxTails = (): Array<{ label: string; value: string; role?: BarRole }> => {
    if (tails.length === 0) return [{ label: 'tails', value: '空', role: 'default' }];
    return tails.map((v, k) => ({
      label: `tails[${k}]`,
      value: String(v),
      role: k === curPos ? 'swap' : 'default',
    }));
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const idx of lisSet) roles[idx] = 'final';
    if (curI >= 0) roles[curI] = 'compare';
    for (const idx of placed) if (!roles[idx]) roles[idx] = 'default';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).setAux(auxTails()).commit();
  };

  snapshot({ zh: `数组：[${a.join(', ')}]`, en: `Array: [${a.join(', ')}]` });

  const hooks: LisNlogHooks = {
    onVisit: (i, val, pos) => {
      curI = i;
      curPos = pos;
      snapshot({
        zh: `处理 a[${i}]=${val}，二分定位 pos=${pos}`,
        en: `Process a[${i}]=${val}, binary-search pos=${pos}`,
      });
    },
    onPlace: (pos, val) => {
      if (pos === tails.length) tails.push(val);
      else tails[pos] = val;
      curPos = pos;
      placed.add(curI);
      snapshot({
        zh: `tails[${pos}] = ${val}${pos === tails.length - 1 && pos > 0 ? '（LIS 变长）' : ''}`,
        en: `tails[${pos}] = ${val}${pos === tails.length - 1 && pos > 0 ? ' (LIS grows)' : ''}`,
      });
    },
  };

  const { length, sub } = lisNlog(a, hooks);

  // 标记最终 LIS（按下标）：由 sub 重建下标
  // 简化：重新跑一遍只为了拿到 sub 的元素顺序对应下标——这里直接用贪心匹配下标
  let ptr = 0;
  for (let i = 0; i < n && ptr < length; i++) {
    if (a[i] === sub[ptr]) {
      lisSet.add(i);
      ptr++;
    }
  }

  curI = -1;
  curPos = -1;
  rec
    .begin({
      zh: `LIS 长度 = ${length}，一条为 [${sub.join(', ')}]`,
      en: `LIS length = ${length}, one is [${sub.join(', ')}]`,
    })
    .setBars(rec.barsFrom(a, Object.fromEntries([...lisSet].map((i) => [i, 'final' as BarRole]))))
    .setAux([
      { label: 'LIS 长度 / length', value: String(length), role: 'final' },
      { label: '一条 LIS', value: `[${sub.join(', ')}]`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
