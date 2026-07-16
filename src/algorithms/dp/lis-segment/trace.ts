// =============================================================================
// LIS 线段树 · 录制帧序列
// 用 setBars 展示原数组（当前元素 'compare'），用 setAux 展示线段树叶节点 dp 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lisSegment, type LisSegmentHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = input;
  const _n = a.length;

  // 离散值表
  const sorted = [...new Set(a)].sort((x, y) => x - y);
  const m = sorted.length;
  const leaf = new Array<number>(m + 1).fill(0); // leaf[rid] = 当前以该值结尾的 LIS
  let curI = -1;
  let curRid = -1;
  let best = 0;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const arr: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '当前最大 LIS', value: String(best), role: 'final' },
    ];
    for (let rid = 1; rid <= m; rid++) {
      arr.push({
        label: `值${sorted[rid - 1]}`,
        value: String(leaf[rid]!),
        role: rid === curRid ? 'swap' : 'default',
      });
    }
    return arr;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) roles[curI] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).setAux(aux()).commit();
  };

  snapshot({ zh: `数组：[${a.join(', ')}]`, en: `Array: [${a.join(', ')}]` });

  const hooks: LisSegmentHooks = {
    onVisit: (i, val, rid) => {
      curI = i;
      curRid = rid;
      snapshot({
        zh: `处理 a[${i}]=${val}（离散值 ${rid}）`,
        en: `Process a[${i}]=${val} (rank ${rid})`,
      });
    },
    onQuery: (rid, bestPrev) => {
      curRid = rid;
      snapshot({
        zh: `查询 [1, ${rid - 1}] 最大 dp = ${bestPrev}`,
        en: `Query [1, ${rid - 1}] max dp = ${bestPrev}`,
      });
    },
    onUpdate: (rid, dpv) => {
      leaf[rid] = Math.max(leaf[rid]!, dpv);
      curRid = rid;
      if (dpv > best) best = dpv;
      snapshot({
        zh: `更新 leaf[${rid}] = ${dpv}（以值 ${sorted[rid - 1]} 结尾的 LIS）`,
        en: `Update leaf[${rid}] = ${dpv} (LIS ending at value ${sorted[rid - 1]})`,
      });
    },
  };

  const result = lisSegment(a, hooks);

  curI = -1;
  curRid = -1;
  rec
    .begin({ zh: `LIS 长度 = ${result}`, en: `LIS length = ${result}` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: 'LIS 长度 / length', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
