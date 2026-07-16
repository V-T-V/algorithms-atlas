// =============================================================================
// 最大子段和（Kadane）· 录制帧序列
// 用 setBars 展示数组：当前考察元素 'pivot'，当前子段 'compare'，最优子段 'final'。
// 用 setAux 展示 cur / best / 区间。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxSubarray, type MaxSubarrayHooks } from './impl.ts';

/** 经典示例。 */
export const DEFAULT_INPUT = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

/** 录制演示帧序列。 */
export function buildTrace(arr: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = arr.length;

  // 当前子段 [curStart, i]；最优子段 [bestStart, bestEnd]
  let curStart = 0;
  let i = 0;
  let bestStart = 0;
  let bestEnd = 0;
  let best = -Infinity;
  let cur = -Infinity;

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let k = 0; k < n; k++) {
      labels[k] = String(arr[k]);
      // 最优子段优先级最高
      if (best > -Infinity && k >= bestStart && k <= bestEnd) roles[k] = 'final';
      else if (k >= curStart && k <= i) roles[k] = 'compare';
      if (k === i) roles[k] = 'pivot';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles, labels))
      .setAux([
        { label: '当前 cur', value: cur === -Infinity ? '—' : String(cur), role: 'compare' },
        { label: '全局 best', value: best === -Infinity ? '—' : String(best), role: 'final' },
        { label: '当前子段 / cur seg', value: `[${curStart}, ${i}]`, role: 'frontier' },
        {
          label: '最优子段 / best seg',
          value: best > -Infinity ? `[${bestStart}, ${bestEnd}]` : '—',
          role: 'final',
        },
      ])
      .commit();
  };

  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).setBars([]).commit();
    return rec.build();
  }

  render({ zh: `数组：${arr.join(', ')}`, en: `Array: ${arr.join(', ')}` });

  const hooks: MaxSubarrayHooks = {
    onStep: (idx, x) => {
      i = idx;
      render({ zh: `考察 a[${i}] = ${x}`, en: `Examine a[${i}] = ${x}` });
    },
    onUpdate: (idx, c, reset) => {
      if (reset) curStart = idx;
      cur = c;
      i = idx;
      render({
        zh: reset ? `前段为累赘，从 ${idx} 重新开段：cur = ${c}` : `接续前段：cur = ${c}`,
        en: reset ? `Restart at ${idx}: cur = ${c}` : `Extend: cur = ${c}`,
      });
    },
    onImprove: (b, s, e) => {
      best = b;
      bestStart = s;
      bestEnd = e;
      render({
        zh: `刷新最优：best = ${b}，区间 [${s}, ${e}]`,
        en: `New best = ${b}, range [${s}, ${e}]`,
      });
    },
    onDone: () => {},
  };

  const result = maxSubarray(arr, hooks);

  // 终态：高亮最优子段
  rec
    .begin({
      zh: `最大子段和 = ${result.best}（子段 ${result.subarray.join(', ')}）`,
      en: `Max subarray sum = ${result.best} (segment ${result.subarray.join(', ')})`,
    })
    .setBars(
      rec.barsFrom(
        arr,
        Object.fromEntries(
          arr.map((_, k) => [
            k,
            k >= result.start && k <= result.end ? ('final' as BarRole) : ('default' as BarRole),
          ]),
        ),
        {},
      ),
    )
    .setAux([
      { label: '最大和 / max sum', value: String(result.best), role: 'final' },
      { label: '区间 / range', value: `[${result.start}, ${result.end}]`, role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
