// =============================================================================
// 杀手棋启发 · 录制帧序列
// 用 setTree 展示博弈树，setAux 展示每层 killer 表 + 统计（剪枝数、访问数）。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  alphaBetaWithKillers,
  buildTree,
  makeKillerTable,
  type KmHooks,
  type KmNode,
  type KillerTable,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [10, 5, 8, 3, 9, 1, 7, 4];
export const DEFAULT_BRANCHING: number = 2;

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `v${nodeIdCounter}`;
}

function toViz(node: KmNode, highlight: Set<string>, evaluated: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (evaluated.has(node.id)) role = 'final';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility}` : `v=${val}`;
  return {
    id: nextId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c.node, highlight, evaluated)),
  };
}

function killerAux(table: KillerTable): Array<{ label: string; value: string; role?: BarRole }> {
  return table.killers.map((list, ply) => ({
    label: `层 ${ply}`,
    value: list.length > 0 ? `[${list.join(',')}]` : '—',
    role: (list.length > 0 ? 'warn' : 'default') as BarRole,
  }));
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root = buildTree({ utilities, branching });
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  const table = makeKillerTable(depth + 1);
  const highlight = new Set<string>();
  const evaluated = new Set<string>();
  let visits = 0;
  let prunes = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated))
      .setAux([
        { label: '访问', value: String(visits), role: 'frontier' },
        { label: '剪枝', value: String(prunes), role: 'warn' },
        ...killerAux(table),
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `初始博弈树（${utilities.length} 叶），开始带 killer 的 alpha-beta`,
    en: `Initial tree (${utilities.length} leaves), start alpha-beta with killers`,
  });

  const hooks: KmHooks = {
    onVisit: (node) => {
      visits += 1;
      highlight.add(node.id);
    },
    onPrune: (node) => {
      prunes += 1;
      highlight.add(node.id);
      evaluated.add(node.id);
      snapshot({
        zh: `节点 ${node.id} 触发 β 剪枝`,
        en: `Node ${node.id} triggers beta cutoff`,
      });
    },
    onKillerRecorded: (ply, moveId) => {
      snapshot({
        zh: `层 ${ply} 记录 killer moveId=${moveId}`,
        en: `Ply ${ply} records killer moveId=${moveId}`,
      });
    },
  };

  alphaBetaWithKillers(root, depth, -Infinity, Infinity, 0, table, 2, hooks);

  nodeIdCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}，剪枝 ${prunes} 次`,
      en: `Done: root value = ${root.value}, ${prunes} cutoffs`,
    })
    .setTree(toViz(root, new Set(), evaluated))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '剪枝', value: String(prunes), role: 'final' },
      ...killerAux(table),
    ])
    .commit();

  return rec.build();
}
