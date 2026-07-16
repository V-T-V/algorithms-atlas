// =============================================================================
// B 树 · 录制帧序列
// 用 setTree 渲染 B 树：每个节点 value 显示其所有关键字（逗号分隔），
// children 为子节点。插入/分裂后重建快照。终态全标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BTree, type BTreeHooks, type BTreeNode } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 5, 6, 12, 30, 7, 17, 3, 1, 25, 40, 15, 22];

let nodeIdCounter = 0;

/** 因每次重建都重新分配 id，highlight 用「键列表签名」匹配更稳定。 */
function toVizByKey(node: BTreeNode | null, highlight: Map<string, BarRole>): TreeNode | null {
  if (!node) return null;
  const signature = node.keys.join(',');
  const tn: TreeNode = {
    id: `n-${signature}-${nodeIdCounter++}`,
    value: signature || '∅',
    role: highlight.get(signature) ?? 'default',
    children: node.children
      .map((c) => toVizByKey(c, highlight) ?? undefined)
      .filter((x): x is TreeNode => x !== undefined),
  };
  return tn;
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, t = 2): Frame[] {
  const rec = new TraceRecorder();
  const tree = new BTree(t);
  const highlight = new Map<string, BarRole>();
  let splitNote = '';

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    const viz = toVizByKey(tree.root, highlight);
    rec
      .begin(note)
      .setTree(viz ?? { id: 'empty', value: '∅' })
      .setAux([
        {
          label: '最小度数 t',
          value: String(t),
          role: 'pivot' as BarRole,
        },
        {
          label: '最大关键字',
          value: String(2 * t - 1),
          role: 'default' as BarRole,
        },
        {
          label: '已插入',
          value: String(input.indexOf(lastInserted) >= 0 ? input.indexOf(lastInserted) + 1 : 0),
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
    splitNote = '';
  };

  let lastInserted = input[0]!;

  rec
    .begin({
      zh: `空 B 树（t=${t}），开始插入 ${input.length} 个值`,
      en: `Empty B-tree (t=${t}), inserting ${input.length} values`,
    })
    .setTree({ id: 'empty', value: '∅' })
    .setAux([
      { label: '最小度数 t', value: String(t), role: 'pivot' },
      { label: '最大关键字', value: String(2 * t - 1), role: 'default' },
    ])
    .commit();

  const hooks: BTreeHooks = {
    onInsert: (value) => {
      lastInserted = value;
      highlight.clear();
      snapshot({
        zh: `插入 ${value}`,
        en: `Insert ${value}`,
      });
    },
    onSplit: (fullKeys, midKey) => {
      splitNote = `节点 [${fullKeys.join(',')}] 已满，分裂，中间关键字 ${midKey} 上推`;
      highlight.clear();
      highlight.set(fullKeys.join(','), 'warn');
      snapshot({
        zh: splitNote,
        en: `Node [${fullKeys.join(',')}] full, split, promote middle key ${midKey}`,
      });
    },
    onPromote: (midKey) => {
      highlight.clear();
      highlight.set(String(midKey), 'pivot');
    },
    onInserted: (value) => {
      highlight.clear();
      highlight.set(String(value), 'final');
      snapshot({
        zh: `${value} 已插入${splitNote ? `（${splitNote}）` : ''}`,
        en: `${value} inserted${splitNote ? ` (${splitNote})` : ''}`,
      });
    },
  };
  tree.setHooks(hooks);
  tree.insertAll(input);

  // 终态：全部标 final
  const markFinal = (node: BTreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      id: `f-${node.keys.join(',')}`,
      value: node.keys.join(',') || '∅',
      role: 'final',
      children: node.children
        .map((c) => markFinal(c) ?? undefined)
        .filter((x): x is TreeNode => x !== undefined),
    };
  };
  rec
    .begin({ zh: 'B 树构建完成（平衡、等高）', en: 'B-tree built (balanced, equal-height leaves)' })
    .setTree(markFinal(tree.root) ?? { id: 'empty', value: '∅' })
    .setAux([
      { label: '最小度数 t', value: String(t), role: 'final' },
      { label: '总关键字数', value: String(input.length), role: 'final' },
      { label: '根关键字', value: tree.root ? tree.root.keys.join(',') : '∅', role: 'final' },
    ])
    .commit();

  return rec.build();
}
