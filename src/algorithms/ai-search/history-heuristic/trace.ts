// =============================================================================
// 历史启发 · 录制帧序列
// 用 setTree 展示博弈树（节点显示搜索值），setMap 展示 history 表，setAux 显示统计。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  alphaBetaWithHistory,
  alphaBetaPlain,
  buildTree,
  makeHistoryTable,
  historyKey,
  type HhHooks,
  type HhNode,
  type HistoryTable,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 12, 8, 2, 4, 6, 14, 10, 5, 1, 9, 7, 11, 13, 0, 15];
export const DEFAULT_BRANCHING: number = 4;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `n${vizCounter}`;
}

function toViz(node: HhNode, highlight: Set<string>, pruned: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (pruned.has(node.id)) role = 'warn';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility ?? '?'}\nv=${val}` : `v=${val}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c.node, highlight, pruned)),
  };
}

function historyAux(
  table: HistoryTable,
  cutoffKeys: Set<string>,
): Array<{ key: string; value: string; role?: BarRole }> {
  const entries = Array.from(table.scores.entries()).sort((a, b) => b[1] - a[1]);
  return entries.map(([k, v]) => ({
    key: k,
    value: String(v),
    role: (cutoffKeys.has(k) ? 'compare' : 'frontier') as BarRole,
  }));
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildTree({ utilities, branching });
  const refRoot = buildTree({ utilities, branching });
  const table = makeHistoryTable();
  const highlight = new Set<string>();
  const prunedNodes = new Set<string>();
  const cutoffKeys = new Set<string>();
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, prunedNodes))
      .setMap(historyAux(table, cutoffKeys))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: 'history 项数', value: String(table.scores.size), role: 'frontier' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'default',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建 ${utilities.length} 叶 / 分支 ${branching} 博弈树，初始 history 表为空`,
    en: `Build ${utilities.length}-leaf / branching ${branching} tree, empty history table`,
  });

  const hooks: HhHooks = {
    onOrder: (_node, _ply, order, fromMove) => {
      step += 1;
      const fm = fromMove === null ? 'root' : `m${fromMove}`;
      highlight.add(_node.id);
      snapshot({
        zh: `${_node.id}：按 history 排序后顺序 = [${order.join(',')}]（来源走法 ${fm}）`,
        en: `${_node.id}: ordered = [${order.join(',')}] (from move ${fm})`,
      });
    },
    onPrune: (node, _ply, fromMove, toMove, depth) => {
      step += 1;
      const key = historyKey(fromMove, toMove);
      cutoffKeys.add(key);
      prunedNodes.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 走法 m${toMove} 触发剪枝，history[${key}] += ${depth}²=${depth * depth}`,
        en: `${node.id} move m${toMove} cutoff, history[${key}] += ${depth}²=${depth * depth}`,
      });
    },
  };

  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  alphaBetaWithHistory(root, depth, -Infinity, Infinity, 0, table, null, hooks);
  const refValue = alphaBetaPlain(refRoot, depth, -Infinity, Infinity);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（与纯 α-β 一致 = ${refValue}）`,
      en: `Done: root = ${root.value} (matches plain α-β = ${refValue})`,
    })
    .setTree(toViz(root, new Set(), prunedNodes))
    .setMap(historyAux(table, new Set()))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: 'history 项数', value: String(table.scores.size), role: 'final' },
      { label: '剪枝次数', value: String(cutoffKeys.size), role: 'warn' },
    ])
    .commit();

  return rec.build();
}
