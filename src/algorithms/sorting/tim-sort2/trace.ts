// =============================================================================
// Tim排序v2 · 录制帧序列
// 用 setBars 展示排序过程：run 用不同色块标记，比较的下标标 'compare'，
// galloping 批量搬移标 'swap'，最终有序标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { timSort2, type TimSort2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [
  // 三段自然 run（升序），n >= 32 以触发多次归并
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16, // run1 升序
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35, // run2 升序
  17,
  18,
  19,
  36,
  37,
  38, // run3
];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const n = a.length;

  const runs: Array<[number, number]> = []; // 已识别的 run 区间
  const sortedRanges: Array<[number, number]> = []; // 已合并完成的有序段
  const compares = new Set<number>();
  const writes = new Set<number>();
  let gallopRange: [number, number] | null = null;

  /** 区间 [lo, hi] 是否落在某个已识别 run 内。 */
  const inRange = (i: number, ranges: Array<[number, number]>): boolean =>
    ranges.some(([lo, hi]) => i >= lo && i <= hi);

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    // 已识别 run 内的元素标 frontier（区分子结构）
    for (let i = 0; i < n; i++) {
      if (inRange(i, sortedRanges)) roles[i] = 'final';
      else if (inRange(i, runs)) roles[i] = 'frontier';
    }
    for (const i of compares) roles[i] = 'compare';
    for (const i of writes) roles[i] = 'swap';
    if (gallopRange) {
      for (let i = gallopRange[0]; i <= gallopRange[1]; i++) roles[i] = 'swap';
    }
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    compares.clear();
    writes.clear();
    gallopRange = null;
  };

  render({ zh: `初始数组：${a.join(', ')}`, en: `Initial: ${a.join(', ')}` });

  const hooks: TimSort2Hooks = {
    onRun: (lo, hi) => {
      runs.push([lo, hi]);
      render({ zh: `识别 run [${lo}, ${hi}]`, en: `Detect run [${lo}, ${hi}]` });
    },
    onInsertionSort: (lo, hi) => {
      render({
        zh: `短 run 补齐：二分插入 [${lo}, ${hi}]`,
        en: `Boost short run: binary insertion [${lo}, ${hi}]`,
      });
    },
    onCompare: (i, j) => {
      compares.add(i);
      compares.add(j);
    },
    onWrite: (dest) => {
      writes.add(dest);
    },
    onMerge: (lo, mid, hi) => {
      render({
        zh: `归并 [${lo},${mid}] 与 [${mid + 1},${hi}]`,
        en: `Merge [${lo},${mid}] and [${mid + 1},${hi}]`,
      });
    },
    onGalloping: (from, count) => {
      void from;
      void count;
    },
    onGallopingSearch: (side, found) => {
      void side;
      void found;
    },
  };

  const out = timSort2(input, hooks);

  // 关键步骤已在钩子中渲染；用最终结果覆盖一次
  for (let i = 0; i < n; i++) a[i] = out[i]!;

  // 终态
  sortedRanges.length = 0;
  runs.length = 0;
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
