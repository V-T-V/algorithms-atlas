// =============================================================================
// AC 自动机 · 录制帧序列
// 用 setTree 展示 trie + fail 指针（边标注），用 setAux 展示匹配结果与当前状态。
// =============================================================================

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ahoCorasick, buildAcAutomaton, acSearch, type AcAutomaton, type AcHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'ushersaysheisahero',
  patterns: ['he', 'she', 'his', 'hers'],
};

/** 把 AC 自动机转成可视化树（根出发，fail 指针通过 edgeLabel 标注）。 */
function acToTree(ac: AcAutomaton, failFrom: number, highlighted: Set<number>): TreeNode {
  const buildNode = (id: number): TreeNode => {
    const node = ac.nodes[id]!;
    const isOut = node.output.length > 0;
    const role = highlighted.has(id)
      ? 'final'
      : isOut
        ? 'pivot'
        : id === failFrom
          ? 'compare'
          : 'default';
    const valueParts = [String(id)];
    if (isOut) valueParts.push(`[${node.output.map((o) => ac.patterns[o]).join('|')}]`);
    const fail = node.fail;
    const failLabel = fail !== 0 && fail !== id ? `fail→${fail}` : '';
    const children: TreeNode[] = [];
    for (const [ch, cid] of node.children) {
      const child = buildNode(cid);
      child.edgeLabel = ch;
      children.push(child);
    }
    // fail 指针若指向非根，附加一个虚拟子节点显示（用特殊前缀）
    if (fail !== 0 && fail !== id) {
      children.push({
        id: `fail-${id}`,
        value: `→${fail}`,
        role: 'compare',
        edgeLabel: 'fail',
      });
    }
    return {
      id: String(id),
      value: valueParts.join(' '),
      role,
      edgeLabel: failLabel || undefined,
      children: children.length ? children : undefined,
    };
  };
  return buildNode(0);
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    text: string;
    patterns: string[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, patterns } = input;

  let highlightState = -1;
  let failFrom = -1;
  const found: Array<{ end: number; pattern: string }> = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    // 先单独构建一次自动机用于树渲染（hooks 只触发状态更新）
    const ac = buildAcAutomaton(patterns);
    const tree = acToTree(ac, failFrom, new Set(highlightState >= 0 ? [highlightState] : []));
    rec
      .begin(note)
      .setTree(tree)
      .setAux([
        { label: 'text', value: text, role: 'default' },
        { label: 'patterns', value: `[${patterns.join(', ')}]`, role: 'pivot' },
        {
          label: '当前状态',
          value: highlightState < 0 ? '—' : String(highlightState),
          role: 'frontier',
        },
        {
          label: '已命中',
          value: found.length ? found.map((f) => `${f.pattern}@${f.end}`).join(', ') : '—',
          role: 'compare',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `构建 trie + fail 指针，模式：${patterns.join(', ')}`,
    en: `Build trie + fail pointers; patterns: ${patterns.join(', ')}`,
  });

  // 展示 BFS 构建 fail 的若干步
  const ac = buildAcAutomaton(patterns, {
    onFail: (node, failTo) => {
      failFrom = node;
      snapshot({
        zh: `fail(${node}) = ${failTo}`,
        en: `fail(${node}) = ${failTo}`,
      });
    },
  });

  // 扫描匹配
  snapshot({ zh: '开始扫描文本', en: 'Begin scanning text' });
  const hooks: AcHooks = {
    onTransfer: (_t, state) => {
      highlightState = state;
    },
    onFound: (end, pi) => {
      found.push({ end, pattern: patterns[pi]! });
    },
  };
  acSearch(text, ac, hooks);
  // 逐字符回放以产生帧（简单做法：重新扫描一次，每个 onTransfer 都 snapshot）
  highlightState = 0;
  let cur = 0;
  for (let t = 0; t < text.length; t++) {
    const ch = text[t]!;
    while (cur !== 0 && !ac.nodes[cur]!.children.has(ch)) cur = ac.nodes[cur]!.fail;
    const nx = ac.nodes[cur]!.children.get(ch);
    cur = nx !== undefined ? nx : 0;
    highlightState = cur;
    for (const pi of ac.nodes[cur]!.output) {
      found.push({ end: t, pattern: patterns[pi]! });
    }
    snapshot({
      zh: `读 '${ch}'（t=${t}）→ 状态 ${cur}`,
      en: `Read '${ch}' (t=${t}) → state ${cur}`,
    });
  }

  // 用 ahoCorasick 重新得到精确结果
  const hits = ahoCorasick(text, patterns);

  // 终态
  const tree = acToTree(
    ac,
    -1,
    new Set(hits.map((h) => ac.nodes.findIndex((n) => n.output.includes(h.patternIdx)))),
  );
  rec
    .begin({
      zh: `完成：${hits.length} 处命中`,
      en: `Done: ${hits.length} hits`,
    })
    .setTree(tree)
    .setAux([
      {
        label: '命中',
        value: hits.length
          ? hits.map((h) => `${h.pattern}@[${h.start}..${h.end}]`).join(', ')
          : '—',
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
