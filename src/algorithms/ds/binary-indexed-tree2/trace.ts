// =============================================================================
// 树状数组区间更新版 · 录制帧序列
// 用 setBars 展示原数组（区间加 + 单点查的当前值），用 setAux 展示差分 BIT。
// 区间加路径标 'compare'，单点查路径标 'pivot'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BinaryIndexedTree2, type BIT2Hooks } from './impl.ts';

/** 演示：建数组后做若干区间加与单点查询。 */
export const DEFAULT_INPUT = {
  values: [2, 1, 5, 3, 4],
  rangeAdds: [
    { l: 1, r: 3, v: 2 }, // 下标 1..3 全 +2
    { l: 2, r: 5, v: -1 }, // 下标 2..5 全 -1
  ],
  queries: [1, 3, 5],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    rangeAdds?: Array<{ l: number; r: number; v: number }>;
    queries?: readonly number[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.values.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }

  let hot = new Set<number>();
  let queryIdx: number | null = null;
  let rangeHL: { l: number; r: number } | null = null;

  const t = BinaryIndexedTree2.fromArray(input.values);

  /** 把当前原数组渲染为 bars（1-based → 0-based 展示）。 */
  const renderBars = () => {
    const arr = t.toArray();
    const roles: Record<number, BarRole> = {};
    if (rangeHL) {
      for (let i = rangeHL.l; i <= rangeHL.r; i++) roles[i - 1] = 'compare';
    }
    if (queryIdx !== null) roles[queryIdx - 1] = 'pivot';
    for (const i of hot) {
      const local = i - 1;
      if (local >= 0 && local < n && roles[local] === undefined) roles[local] = 'frontier';
    }
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) labels[i] = `[${i + 1}]`;
    return rec.barsFrom(arr, roles, labels);
  };

  const snapshot = (
    note: { zh: string; en: string },
    aux?: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    rec.begin(note).setBars(renderBars());
    if (aux) rec.setAux(aux);
    rec.commit();
  };

  // —— 初始化阶段 ——
  rangeHL = null;
  queryIdx = null;
  hot = new Set<number>();
  snapshot({
    zh: `初始化数组 [${input.values.join(', ')}]（差分 BIT 已建）`,
    en: `Init array [${input.values.join(', ')}] (diff BIT built)`,
  });

  // —— 区间加阶段 ——
  const addHooks: BIT2Hooks = {
    onRangeStep: (i) => {
      hot = new Set([i]);
    },
  };
  for (const ra of input.rangeAdds ?? []) {
    hot = new Set<number>();
    rangeHL = { l: ra.l, r: ra.r };
    snapshot({
      zh: `rangeAdd(${ra.l}, ${ra.r}, ${ra.v})：diff[${ra.l}]+=${ra.v}, diff[${ra.r + 1}]-=${ra.v}`,
      en: `rangeAdd(${ra.l}, ${ra.r}, ${ra.v}): diff[${ra.l}]+=${ra.v}, diff[${ra.r + 1}]-=${ra.v}`,
    });
    t.rangeAdd(ra.l, ra.r, ra.v, addHooks);
    snapshot({ zh: '区间加完成（沿 lowbit 维护差分 BIT）', en: 'Range add done (lowbit climb)' });
  }

  // —— 单点查询阶段 ——
  const queryHooks: BIT2Hooks = {
    onQueryStep: (i) => {
      hot = new Set([i]);
    },
  };
  for (const q of input.queries ?? []) {
    hot = new Set<number>();
    rangeHL = null;
    queryIdx = q;
    const val = t.pointQuery(q, queryHooks);
    snapshot(
      { zh: `pointQuery(${q}) = ${val}（前缀和差分 BIT）`, en: `pointQuery(${q}) = ${val}` },
      [{ label: `a[${q}]`, value: String(val), role: 'final' }],
    );
  }

  // 终态
  hot = new Set<number>();
  rangeHL = null;
  queryIdx = null;
  const finalArr = t.toArray();
  rec
    .begin({
      zh: `完成；当前数组 [${finalArr.join(', ')}]`,
      en: `Done; current array [${finalArr.join(', ')}]`,
    })
    .setBars(rec.barsFrom(finalArr, {}, {}))
    .setAux([
      { label: '差分 BIT', value: `[${t.toBitArray().slice(1).join(', ')}]`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
