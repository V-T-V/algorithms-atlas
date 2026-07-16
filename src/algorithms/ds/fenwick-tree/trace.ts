// =============================================================================
// 树状数组 · 录制帧序列
// 通过 FenwickTree 的钩子，把执行过程录成 Frame[]。
// 用 setBars 展示 bit 数组（1-based），setAux 展示前缀和与区间和。
// 当前爬升/汇总路径上的下标标 'compare'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FenwickTree, type FenwickHooks } from './impl.ts';

/** 演示：建树后做若干区间查询与单点更新。 */
export const DEFAULT_INPUT = {
  values: [2, 1, 5, 3, 4],
  queries: [
    { l: 1, r: 5 }, // 全区间
    { l: 2, r: 4 },
  ],
  updates: [{ idx: 3, delta: 3 }], // 第 3 个 +3
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    queries?: Array<{ l: number; r: number }>;
    updates?: Array<{ idx: number; delta: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.values.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }

  let hot = new Set<number>();
  let highlightIdx: number | null = null;

  /** 把当前 bit 数组渲染为 bars（1-based：从下标 1 开始）。 */
  const renderBars = (ft: FenwickTree) => {
    const full = ft.toArray(); // [0..n]，下标 0 不展示
    const values: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let i = 1; i <= n; i++) {
      const localIdx = i - 1; // 转回 0-based 给 bars
      values.push(full[i] ?? 0);
      if (hot.has(i)) roles[localIdx] = 'compare';
      if (highlightIdx === i) roles[localIdx] = 'pivot';
    }
    const labels: Record<number, string> = {};
    for (let i = 1; i <= n; i++) labels[i - 1] = `[${i}]`;
    return rec.barsFrom(values, roles, labels);
  };

  const snapshot = (
    ft: FenwickTree,
    note: { zh: string; en: string },
    aux?: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    rec.begin(note).setBars(renderBars(ft));
    if (aux) rec.setAux(aux);
    rec.commit();
  };

  // —— 建树阶段 ——
  const ft = new FenwickTree(n); // 预分配长度 n 的空 BIT，逐个 add
  const buildHooks: FenwickHooks = {
    onUpdateStep: (i) => {
      hot = new Set([i]);
    },
  };
  snapshot(ft, { zh: `空 BIT（长度 ${n}）`, en: `Empty BIT (size ${n})` });
  for (let i = 0; i < n; i++) {
    highlightIdx = i + 1;
    ft.add(i + 1, input.values[i]!, buildHooks);
    snapshot(ft, {
      zh: `add(${i + 1}, ${input.values[i]})：沿 lowbit 爬升更新`,
      en: `add(${i + 1}, ${input.values[i]}): climb by lowbit`,
    });
  }
  highlightIdx = null;
  hot = new Set<number>();
  snapshot(ft, {
    zh: `建树完成，bit = [${ft.toArray().slice(1).join(', ')}]`,
    en: `Built, bit = [${ft.toArray().slice(1).join(', ')}]`,
  });

  // —— 查询阶段 ——
  const queryHooks: FenwickHooks = {
    onQueryStep: (i) => {
      hot = new Set([i]);
    },
  };
  for (const q of input.queries ?? []) {
    hot = new Set<number>();
    snapshot(ft, {
      zh: `区间和 [${q.l}, ${q.r}] = prefixSum(${q.r}) − prefixSum(${q.l - 1})`,
      en: `Range [${q.l}, ${q.r}] = prefixSum(${q.r}) − prefixSum(${q.l - 1})`,
    });
    const sum = ft.rangeSum(q.l, q.r, queryHooks);
    snapshot(ft, { zh: `sum[${q.l}, ${q.r}] = ${sum}`, en: `sum[${q.l}, ${q.r}] = ${sum}` }, [
      { label: '区间和', value: String(sum), role: 'final' },
    ]);
  }

  // —— 更新阶段 ——
  const updateHooks: FenwickHooks = {
    onUpdateStep: (i) => {
      hot = new Set([i]);
    },
  };
  for (const u of input.updates ?? []) {
    hot = new Set<number>();
    highlightIdx = u.idx;
    snapshot(ft, {
      zh: `单点更新：add(${u.idx}, ${u.delta})`,
      en: `Point update: add(${u.idx}, ${u.delta})`,
    });
    ft.add(u.idx, u.delta, updateHooks);
    snapshot(ft, { zh: '更新完成', en: 'Update done' });
  }

  // 终态
  hot = new Set<number>();
  highlightIdx = null;
  const total = ft.prefixSum(n);
  rec
    .begin({
      zh: `完成，总前缀和 = ${total}`,
      en: `Done, total prefix sum = ${total}`,
    })
    .setBars(renderBars(ft))
    .setAux([{ label: '总和', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
