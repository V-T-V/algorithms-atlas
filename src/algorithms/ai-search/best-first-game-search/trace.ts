// =============================================================================
// 博弈最佳优先搜索 B* · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bstar, buildTree, DEFAULT_BSTAR_CONFIG, type BstarHooks, type BstarNode } from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 12, 8, 2, 4, 6, 14, 10, 5];
export const DEFAULT_BRANCHING: number = 3;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(node: BstarNode, highlight: Set<string>, expanded: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (expanded.has(node.id)) role = 'frontier';
  else if (node.expanded) role = 'sorted';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const value = isLeaf
    ? `u=${node.utility ?? '?'}`
    : `opt=${node.opt.toFixed(0)}\npess=${node.pess.toFixed(0)}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, expanded)),
  };
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildTree({ utilities, branching });
  const highlight = new Set<string>();
  const expandedSet = new Set<string>();
  let expandCount = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, expandedSet))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '展开次数', value: String(expandCount), role: 'frontier' },
        { label: '根 opt', value: root.opt.toFixed(0), role: 'pivot' },
        { label: '根 pess', value: root.pess.toFixed(0), role: 'frontier' },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建博弈树（${utilities.length} 叶，分支 ${branching}），叶子用 utility ± ${DEFAULT_BSTAR_CONFIG.tolerance} 作为 opt/pess`,
    en: `Build tree; leaves get opt/pess = utility ± ${DEFAULT_BSTAR_CONFIG.tolerance}`,
  });

  const hooks: BstarHooks = {
    onExpand: (node) => {
      step += 1;
      expandCount += 1;
      expandedSet.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `展开节点 ${node.id}（${node.isMax ? 'MAX' : 'MIN'}）：opt=${node.opt.toFixed(0)}, pess=${node.pess.toFixed(0)}`,
        en: `Expand ${node.id} (${node.isMax ? 'MAX' : 'MIN'}): opt=${node.opt.toFixed(0)}, pess=${node.pess.toFixed(0)}`,
      });
    },
    onPropagate: (node) => {
      snapshot({
        zh: `传播：${node.id} 更新为 opt=${node.opt.toFixed(0)}, pess=${node.pess.toFixed(0)}`,
        en: `Propagate: ${node.id} → opt=${node.opt.toFixed(0)}, pess=${node.pess.toFixed(0)}`,
      });
    },
    onProven: (best) => {
      step += 1;
      highlight.add(best.id);
      snapshot({
        zh: `证明：${best.id} 是最优根子节点（pess=${best.pess.toFixed(0)} ≥ 其他 opt）`,
        en: `Proven: ${best.id} is best root child (pess=${best.pess.toFixed(0)} >= others' opt)`,
      });
    },
  };

  const result = bstar(root, DEFAULT_BSTAR_CONFIG, hooks);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：推荐根子节点 ${result.id}（opt=${result.opt.toFixed(0)}, pess=${result.pess.toFixed(0)}）`,
      en: `Done: best root child ${result.id} (opt=${result.opt.toFixed(0)}, pess=${result.pess.toFixed(0)})`,
    })
    .setTree(toViz(root, new Set(), expandedSet))
    .setAux([
      { label: '推荐子节点', value: result.id, role: 'final' },
      { label: '展开次数', value: String(expandCount), role: 'final' },
    ])
    .commit();

  return rec.build();
}
