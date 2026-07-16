// =============================================================================
// Kadane · 录制帧序列
// 用 setBars 展示数组，高亮当前下标、当前累加区间与最优子数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kadane, type KadaneHooks } from './impl.ts';

export const DEFAULT_INPUT = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

interface TraceOptions {
  arr: number[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const arr = opts.arr ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();

  let curIdx = -1;
  let curStart = 0;
  let curEnd = -1; // 当前 curMax 区间
  let bestStart = 0;
  let bestEnd = -1; // 全局最优区间
  let curMaxVal = 0;
  let globalMaxVal = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = arr.map((v, i) => {
      let role: BarRole = 'default';
      if (i >= bestStart && i <= bestEnd) role = 'final';
      if (i >= curStart && i <= curEnd) role = role === 'final' ? 'final' : 'compare';
      if (i === curIdx) role = 'swap';
      return { value: v, role };
    });
    const aux = [
      { label: '当前 i', value: curIdx >= 0 ? String(curIdx) : '-', role: 'swap' as BarRole },
      { label: 'curMax', value: String(curMaxVal), role: 'compare' as BarRole },
      { label: 'globalMax', value: String(globalMaxVal), role: 'final' as BarRole },
      {
        label: '当前区间',
        value: curEnd >= curStart ? `[${curStart}, ${curEnd}]` : '-',
        role: 'compare' as BarRole,
      },
      {
        label: '最优区间',
        value: bestEnd >= bestStart ? `[${bestStart}, ${bestEnd}]` : '-',
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始数组：[${arr.join(', ')}]`,
    en: `Initial array: [${arr.join(', ')}]`,
  });

  const hooks: KadaneHooks = {
    onStep: (i, curMax, globalMax) => {
      curIdx = i;
      curMaxVal = curMax;
      globalMaxVal = globalMax;
      // 推断当前区间：若 curMax 刚重置（即 curMax == arr[i] 且之前 curMax<0），curStart=i
      // 这里简单处理：curStart 由 onUpdateBest 不维护，我们用 curMax 是否等于 arr[i] 判断重置
      if (curMax === arr[i]) {
        curStart = i;
      }
      curEnd = i;
      snapshot({
        zh: `i=${i}：curMax=${curMax}，globalMax=${globalMax}`,
        en: `i=${i}: curMax=${curMax}, globalMax=${globalMax}`,
      });
    },
    onUpdateBest: (s, e) => {
      bestStart = s;
      bestEnd = e;
    },
  };

  kadane(arr, hooks);

  // 终态：仅高亮最优子数组
  rec
    .begin({
      zh: `完成：最大子数组和 = ${globalMaxVal}，区间 [${bestStart}, ${bestEnd}]`,
      en: `Done: max subarray sum = ${globalMaxVal}, range [${bestStart}, ${bestEnd}]`,
    })
    .setBars(
      arr.map((v, i) => ({
        value: v,
        role: (i >= bestStart && i <= bestEnd ? 'final' : 'default') as BarRole,
        label: i >= bestStart && i <= bestEnd ? String(v) : undefined,
      })),
    )
    .setAux([
      { label: '最大和', value: String(globalMaxVal), role: 'final' as BarRole },
      { label: '最优区间', value: `[${bestStart}, ${bestEnd}]`, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
