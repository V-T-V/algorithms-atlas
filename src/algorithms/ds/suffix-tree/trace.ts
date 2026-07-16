// =============================================================================
// 后缀树 · 录制帧序列
// 用 setTree 展示压缩后缀树（节点 value = 子串片段，叶子带 * 与后缀号）。
// 新建节点标 'compare'，分裂标 'swap'，最终叶子标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SuffixTree, type SuffixTreeHooks, STNode, STEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'banana',
  patterns: ['ana', 'nan', 'xyz'],
};

/** 把内部 STNode 转成可视化 TreeNode。highlightEdges: 高亮的边首字符集合。 */
function toViz(
  root: STNode,
  text: string,
  opts: {
    newNodes?: Set<STNode>;
    splitNodes?: Set<STNode>;
    matchedLeaves?: Set<number>;
  } = {},
): TreeNode {
  let counter = 0;
  const idMap = new Map<STNode, string>();
  const idOf = (n: STNode): string => {
    if (!idMap.has(n)) idMap.set(n, `s${counter++}`);
    return idMap.get(n)!;
  };
  const build = (n: STNode, edgeLabel: string): TreeNode => {
    let role: BarRole | undefined;
    if (opts.splitNodes?.has(n)) role = 'swap';
    else if (opts.newNodes?.has(n)) role = 'compare';
    else if (n.children.size === 0 && n.suffixStart >= 0 && opts.matchedLeaves?.has(n.suffixStart))
      role = 'final';
    const childEntries = [...n.children.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const children: TreeNode[] = [];
    for (const [, edge] of childEntries) {
      const label = text.slice(edge.start, edge.end + 1);
      const childNode = build(edge.child, label);
      childNode.edgeLabel = label;
      children.push(childNode);
    }
    const isLeaf = n.children.size === 0 && n.suffixStart >= 0;
    return {
      id: idOf(n),
      value: isLeaf ? `${edgeLabel || '∅'}*(${n.suffixStart})` : edgeLabel || '∅',
      children: children.length ? children : undefined,
      role,
    };
  };
  return build(root, '');
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { text: string; patterns?: readonly string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const newNodes = new Set<STNode>();
  const splitNodes = new Set<STNode>();
  const matchedLeaves = new Set<number>();

  const render = (root: STNode, text: string, note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(toViz(root, text, { newNodes, splitNodes, matchedLeaves }))
      .commit();
    newNodes.clear();
    splitNodes.clear();
  };

  const fullText = input.text.endsWith('$') ? input.text : input.text + '$';

  // 占位根用于首帧
  const placeholderRoot = new STNode();
  render(placeholderRoot, fullText, {
    zh: `文本 "${input.text}"（补哨兵 $）`,
    en: `Text "${input.text}" (with sentinel $)`,
  });

  // 用一个可变的根引用，钩子在建树过程中可访问（首帧前为占位树）
  let liveRoot = placeholderRoot;
  const hooks: SuffixTreeHooks = {
    onInsertSuffix: (start) => {
      render(liveRoot, fullText, {
        zh: `插入后缀 "${fullText.slice(start)}"（起点 ${start}）`,
        en: `Insert suffix "${fullText.slice(start)}" (start ${start})`,
      });
    },
    onBuilt: () => {
      // 切换到真实根
    },
  };

  const st = new SuffixTree(input.text, hooks);
  liveRoot = st.root;

  // 展示最终树
  render(st.root, st.text, {
    zh: `构造完成，共 ${st.totalNodes} 个节点`,
    en: `Built, ${st.totalNodes} nodes`,
  });

  // 模式匹配阶段
  for (const p of input.patterns ?? []) {
    matchedLeaves.clear();
    const found = st.contains(p);
    if (found) {
      const occ = st.occurrences(p);
      for (const s of occ) matchedLeaves.add(s);
    }
    render(
      st.root,
      st.text,
      found
        ? {
            zh: `匹配 "${p}"：命中 ${matchedLeaves.size} 处`,
            en: `Match "${p}": ${matchedLeaves.size} hits`,
          }
        : { zh: `匹配 "${p}"：未命中`, en: `Match "${p}": not found` },
    );
  }

  // 终态
  matchedLeaves.clear();
  rec.begin({ zh: `完成`, en: `Done` }).setTree(toViz(st.root, st.text)).commit();

  return rec.build();
}

void STEdge;
