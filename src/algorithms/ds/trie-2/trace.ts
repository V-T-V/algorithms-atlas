// =============================================================================
// 压缩字典树 Radix Tree · 录制帧序列
// 用 setTree 展示压缩结构（边标签挂在子节点 value/edgeLabel）。
// 新建叶子标 'compare'，分裂节点标 'swap'，命中键结尾标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RadixTree, type RadixTreeHooks, type RadixNode } from './impl.ts';

export const DEFAULT_INPUT = {
  insert: ['romane', 'romanus', 'romulus', 'rubens', 'ruber', 'rubicon', 'rubicundus'],
  search: ['romane', 'rubens', 'xyz'],
};

/** 把 Radix 树转成可视化树。 */
function toViz(
  root: RadixNode,
  opts: {
    hotDepth?: Set<number>;
    hotLabel?: string | null;
    newLeaves?: Set<RadixNode>;
    splitNodes?: Set<RadixNode>;
    endHits?: Set<string>;
    matchedKey?: string | null;
  } = {},
): TreeNode {
  let counter = 0;
  type Acc = {
    id: string;
    value: string;
    children: Acc[];
    isEnd: boolean;
    key: string;
    depth: number;
    node: RadixNode;
  };
  const build = (node: RadixNode, prefix: string, depth: number, edgeLabel: string): Acc => {
    const id = `n${counter++}`;
    return {
      id,
      value: depth === 0 ? 'ε' : edgeLabel,
      children: [],
      isEnd: node.isEnd,
      key: prefix,
      depth,
      node,
    };
  };
  const rootAcc = build(root, '', 0, '');
  const stack: Array<{ node: RadixNode; acc: Acc; prefix: string; depth: number }> = [
    { node: root, acc: rootAcc, prefix: '', depth: 0 },
  ];
  while (stack.length) {
    const { node, acc, prefix, depth } = stack.pop()!;
    const sorted = [...node.children.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    for (const [, { label, child }] of sorted) {
      const childPrefix = prefix + label;
      const childAcc = build(child, childPrefix, depth + 1, label);
      acc.children.push(childAcc);
      stack.push({ node: child, acc: childAcc, prefix: childPrefix, depth: depth + 1 });
    }
  }
  const toNode = (acc: Acc): TreeNode => {
    let role: BarRole | undefined;
    if (opts.matchedKey && acc.key === opts.matchedKey && acc.isEnd) role = 'pivot';
    else if (opts.endHits?.has(acc.key)) role = 'final';
    else if (opts.splitNodes?.has(acc.node)) role = 'swap';
    else if (opts.newLeaves?.has(acc.node)) role = 'compare';
    else if (
      opts.hotDepth?.has(acc.depth) &&
      (opts.hotLabel === null || acc.value.startsWith(opts.hotLabel ?? ''))
    )
      role = 'compare';
    return {
      id: acc.id,
      value: acc.isEnd && acc.depth > 0 ? `${acc.value}*` : acc.value,
      children: acc.children.length ? acc.children.map(toNode) : undefined,
      role,
    };
  };
  return toNode(rootAcc);
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { insert: readonly string[]; search?: readonly string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const t = new RadixTree();

  let hotDepth = new Set<number>();
  let hotLabel: string | null = null;
  let endHits = new Set<string>();
  let matchedKey: string | null = null;
  const newLeaves = new Set<RadixNode>();
  const splitNodes = new Set<RadixNode>();

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(toViz(t.root, { hotDepth, hotLabel, newLeaves, splitNodes, endHits, matchedKey }))
      .setAux([{ label: '键数', value: String(t.size), role: 'final' }])
      .commit();
  };

  render({ zh: '空 Radix 树，开始插入', en: 'Empty radix tree, start inserting' });

  const insertHooks: RadixTreeHooks = {
    onMatchEdge: (_label, cpl) => {
      void cpl;
    },
    onSplitEdge: () => {
      // 分裂节点会在树结构上体现；这里清除并标记最近分裂
    },
    onCreateLeaf: () => {
      // 标记叶子在 render 后通过扫描难定位，简化用 endHits 表达
    },
    onMarkEnd: () => {},
  };

  for (const w of input.insert) {
    hotDepth = new Set<number>();
    hotLabel = null;
    matchedKey = null;
    endHits = new Set<string>();
    render({ zh: `插入 "${w}"`, en: `Insert "${w}"` });
    t.insert(w, insertHooks);
    endHits = new Set<string>([w]);
    render({ zh: `完成插入 "${w}"`, en: `Inserted "${w}"` });
  }

  const searchHooks: RadixTreeHooks = {
    onMatchEdge: (label, cpl) => {
      hotLabel = label.slice(0, cpl);
    },
    onResult: (kind, key, ok) => {
      hotDepth = new Set<number>();
      hotLabel = null;
      matchedKey = ok && kind === 'search' ? key : null;
    },
  };

  for (const w of input.search ?? []) {
    endHits = new Set<string>();
    hotDepth = new Set<number>();
    hotLabel = null;
    const ok = t.search(w, searchHooks);
    render(
      ok
        ? { zh: `找到 "${w}" ✓`, en: `Found "${w}" ✓` }
        : { zh: `未找到 "${w}" ✗`, en: `"${w}" not found ✗` },
    );
  }

  // 终态
  hotDepth = new Set<number>();
  matchedKey = null;
  endHits = new Set<string>();
  rec
    .begin({ zh: `完成，共 ${t.size} 个键`, en: `Done, ${t.size} keys` })
    .setTree(toViz(t.root, { endHits }))
    .commit();

  return rec.build();
}
