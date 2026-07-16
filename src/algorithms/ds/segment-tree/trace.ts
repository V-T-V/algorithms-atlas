// =============================================================================
// 线段树 · 录制帧序列
// 通过 SegmentTree 的钩子，把执行过程录成 Frame[]。
// 用 setBars 展示原数组（高亮查询/更新区间），用 setTree 展示线段树结构。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SegmentTree, type SegTreeHooks } from './impl.ts';

/** 演示：建树后做若干区间查询与单点更新。 */
export const DEFAULT_INPUT = {
  values: [2, 1, 5, 3, 4],
  queries: [
    { ql: 0, qr: 4 }, // 全区间 = 15
    { ql: 1, qr: 3 }, // 1+5+3 = 9
  ],
  updates: [{ pos: 2, val: 8 }], // 5 -> 8
};

/** 节点信息表：node → { lo, hi, val }。 */
type NodeInfo = Map<number, { lo: number; hi: number; val: number }>;

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    queries?: Array<{ ql: number; qr: number }>;
    updates?: Array<{ pos: number; val: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.values.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }

  // 维护一张 node → [lo, hi, val] 的表（建树钩子里填充）
  const nodeInfo: NodeInfo = new Map();
  const arr = [...input.values];
  const hotNodes = new Set<number>(); // 当前查询/更新路径
  const fullNodes = new Set<number>(); // 完全落入查询区间的节点
  let highlightRange: { lo: number; hi: number } | null = null;
  let updatePos: number | null = null;

  /** 把原数组渲染成 bars。 */
  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    if (highlightRange) {
      for (let i = highlightRange.lo; i <= highlightRange.hi; i++) roles[i] = 'compare';
    }
    if (updatePos !== null) roles[updatePos] = 'pivot';
    return rec.barsFrom(arr, roles);
  };

  /** 递归构造可视化树（使用 nodeInfo）。 */
  const renderTreeNode = (node: number): TreeNode | null => {
    const info = nodeInfo.get(node);
    if (info === undefined) return null;
    let role: BarRole | undefined;
    if (fullNodes.has(node)) role = 'final';
    else if (hotNodes.has(node)) role = 'compare';
    const left = renderTreeNode(2 * node);
    const right = renderTreeNode(2 * node + 1);
    const children: TreeNode[] = [];
    if (left) children.push(left);
    if (right) children.push(right);
    return {
      id: `n${node}`,
      value: `${info.val}[${info.lo}-${info.hi}]`,
      children: children.length ? children : undefined,
      role,
    };
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const root = renderTreeNode(1);
    rec
      .begin(note)
      .setBars(renderBars())
      .setTree(root ?? { id: 'empty', value: '∅', role: 'default' })
      .commit();
  };

  const st = new SegmentTree(input.values);

  // —— 建树阶段 ——
  const buildHooks: SegTreeHooks = {
    onBuildNode: (node, lo, hi, val) => {
      nodeInfo.set(node, { lo, hi, val });
    },
  };
  // 重建一次以触发 onBuildNode（构造时未带钩子）
  st.build(input.values, buildHooks);
  snapshot({
    zh: `建树完成：数组 [${arr.join(', ')}]`,
    en: `Tree built from [${arr.join(', ')}]`,
  });

  // —— 查询阶段 ——
  const queryHooks: SegTreeHooks = {
    onQueryVisit: (node, lo, hi, fully) => {
      nodeInfo.set(node, { lo, hi, val: nodeInfo.get(node)?.val ?? 0 });
      hotNodes.add(node);
      if (fully) fullNodes.add(node);
    },
  };

  for (const q of input.queries ?? []) {
    hotNodes.clear();
    fullNodes.clear();
    highlightRange = { lo: q.ql, hi: q.qr };
    updatePos = null;
    snapshot({
      zh: `查询区间 [${q.ql}, ${q.qr}] 的和`,
      en: `Query sum of [${q.ql}, ${q.qr}]`,
    });
    const sum = st.query(q.ql, q.qr, queryHooks);
    snapshot({
      zh: `sum[${q.ql}, ${q.qr}] = ${sum}`,
      en: `sum[${q.ql}, ${q.qr}] = ${sum}`,
    });
  }

  // —— 更新阶段 ——
  const updateHooks: SegTreeHooks = {
    onUpdateNode: (node, lo, hi, val) => {
      nodeInfo.set(node, { lo, hi, val });
      hotNodes.add(node);
    },
  };

  for (const u of input.updates ?? []) {
    hotNodes.clear();
    fullNodes.clear();
    highlightRange = null;
    updatePos = u.pos;
    const old = arr[u.pos]!;
    arr[u.pos] = u.val;
    snapshot({
      zh: `更新下标 ${u.pos}：${old} → ${u.val}`,
      en: `Update index ${u.pos}: ${old} → ${u.val}`,
    });
    st.update(u.pos, u.val, updateHooks);
    updatePos = null;
    snapshot({ zh: '更新完成，受影响节点已刷新', en: 'Update done, affected nodes refreshed' });
  }

  // 终态
  hotNodes.clear();
  fullNodes.clear();
  highlightRange = null;
  rec
    .begin({
      zh: `完成；数组 [${arr.join(', ')}]，根节点和 = ${st.query(0, n - 1)}`,
      en: `Done; array [${arr.join(', ')}], root sum = ${st.query(0, n - 1)}`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setTree(renderTreeNode(1) ?? { id: 'empty', value: '∅', role: 'default' })
    .commit();

  return rec.build();
}
