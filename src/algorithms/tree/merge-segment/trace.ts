// 可合并线段树 · 录制帧序列
// 演示：先建两棵独立权值线段树，再把它们合并，最后做一次区间查询。

import type { BarRole, BarState, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MergeableSegTree, type MergeSegHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 值域 [1, 8]
  domain: { lo: 1, hi: 8 },
  // A 组：在位置 2 加 3、位置 5 加 4
  groupA: [
    [2, 3],
    [5, 4],
  ] as Array<[number, number]>,
  // B 组：在位置 2 加 1、位置 7 加 5
  groupB: [
    [2, 1],
    [7, 5],
  ] as Array<[number, number]>,
  query: { l: 1, r: 8 },
};

export function buildTrace(
  input: {
    domain?: { lo: number; hi: number };
    groupA?: Array<[number, number]>;
    groupB?: Array<[number, number]>;
    query?: { l: number; r: number };
  } = {},
): Frame[] {
  const {
    domain = DEFAULT_INPUT.domain,
    groupA = DEFAULT_INPUT.groupA,
    groupB = DEFAULT_INPUT.groupB,
    query = DEFAULT_INPUT.query,
  } = input;
  const rec = new TraceRecorder();
  const M = domain.hi;

  // 每个权值位置上的累计值（用于 setBars 展示）
  const acc = new Array<number>(M + 1).fill(0);
  const snapshot = (highlight: Set<number>, role: BarRole = 'compare'): BarState[] =>
    rec.barsFrom(
      acc.slice(1),
      Object.fromEntries([...highlight].map((p) => [p - 1, role])) as Record<number, BarRole>,
    );

  rec
    .begin({
      zh: `值域 [${domain.lo}, ${M}]，将合并两组权值数据`,
      en: `Domain [${domain.lo}, ${M}], merging two weighted datasets`,
    })
    .setBars(rec.barsFrom(acc.slice(1)))
    .commit();

  const buildHooks: MergeSegHooks = {
    onUpdate: (_root, pos) => {
      rec
        .begin({
          zh: `插入位置 ${pos}`,
          en: `Insert position ${pos}`,
        })
        .setBars(snapshot(new Set([pos])))
        .commit();
    },
  };

  // 建树 A
  const tA = new MergeableSegTree(domain.lo, M, buildHooks);
  for (const [pos, w] of groupA) {
    tA.update(pos, w);
    acc[pos]! += w;
    rec
      .begin({ zh: `树 A：位置 ${pos} += ${w}`, en: `Tree A: pos ${pos} += ${w}` })
      .setBars(snapshot(new Set([pos]), 'final'))
      .commit();
  }
  // 建树 B
  const tB = new MergeableSegTree(domain.lo, M, buildHooks);
  for (const [pos, w] of groupB) {
    tB.update(pos, w);
    rec
      .begin({ zh: `树 B：位置 ${pos} += ${w}`, en: `Tree B: pos ${pos} += ${w}` })
      .setBars(snapshot(new Set([pos]), 'pivot'))
      .commit();
  }

  // 合并：把 B 合并进 A（先用一个新树承载以触发 hook）
  const mergeHooks: MergeSegHooks = {
    onMerge: (l, r, sumA, sumB) => {
      rec
        .begin({
          zh: `合并节点 [${l},${r}]：sumA=${sumA} + sumB=${sumB} = ${sumA + sumB}`,
          en: `Merge node [${l},${r}]: sumA=${sumA} + sumB=${sumB} = ${sumA + sumB}`,
        })
        .setAux([
          { label: '[l,r]', value: `[${l},${r}]`, role: 'compare' },
          { label: 'sumA', value: String(sumA), role: 'final' },
          { label: 'sumB', value: String(sumB), role: 'pivot' },
        ])
        .commit();
    },
  };
  // 把 B 的数据加进 acc（演示）
  for (const [pos, w] of groupB) acc[pos]! += w;

  // 用一个 wrapper 触发 merge
  const merged = new MergeableSegTree(domain.lo, M, mergeHooks);
  merged.setRoot(tA.getRoot());
  // 直接调用底层 merge：借助 mergeInto 需要 MergeableSegTree，这里把 tB 合并进 merged
  merged.mergeInto(tB);

  rec
    .begin({
      zh: '合并完成，合并后各位置累计值',
      en: 'Merge done, accumulated values per position',
    })
    .setBars(snapshot(new Set(), 'final'))
    .commit();

  // 区间查询
  const ans = merged.rangeSum(query.l, query.r);
  const range = new Set<number>();
  for (let p = query.l; p <= query.r; p++) range.add(p);
  rec
    .begin({
      zh: `rangeSum(${query.l}, ${query.r}) = ${ans}`,
      en: `rangeSum(${query.l}, ${query.r}) = ${ans}`,
    })
    .setBars(snapshot(range, 'final'))
    .commit();

  return rec.build();
}
