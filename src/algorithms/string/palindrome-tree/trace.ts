// =============================================================================
// 回文树 Palindrome Tree (Eertree) · 录制帧序列
// 用 setTree 展示以偶根(1)为根的回文树结构；用 setAux 展示 len/fail/count 表
// 以及当前扫描位置。奇根(0, len=-1) 作为偶根的 fail 出现在说明里。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildPalindromeTree, type PalindromeTree } from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'abacaba',
};

/** 把回文树转成 TreeNode 树（以偶根为入口；奇根的转移被吸收为特殊节点）。 */
function treeToNode(tree: PalindromeTree, highlight: Set<number>, curLast: number): TreeNode {
  // 反向收集：每个节点的「父」即添加它时所在的状态；直接用 next 关系向下展开
  // 以偶根(1)为入口；奇根(0) 单独作为一棵子入口
  const build = (id: number, edgeChar: string): TreeNode => {
    const node = tree.nodes[id]!;
    let role: BarRole = 'default';
    if (highlight.has(id)) role = 'frontier';
    if (id === curLast) role = 'compare';
    const children: TreeNode[] = [];
    for (const [ch, cid] of node.next) {
      children.push(build(cid, ch));
    }
    return {
      id: `n${id}`,
      value: `#${id} len=${node.len} cnt=${node.count}`,
      role,
      edgeLabel: edgeChar || undefined,
      children: children.length ? children : undefined,
    };
  };
  // 从偶根和奇根分别出发（奇根的转移指向单字符回文，偶根的转移指向更长偶回文）
  const odd = build(0, '');
  const even = build(1, '');
  // 把奇根作为偶根的一个特殊子节点展示
  return {
    id: 'root',
    value: 'PALIN-TREE',
    role: 'pivot',
    children: [even, odd],
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text } = input;

  let live: PalindromeTree = buildPalindromeTree(text);
  let highlight = new Set<number>();
  let curLast = 1;
  let curI = -1;

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const lenArr = live.nodes.map((n) => n.len);
    const failArr = live.nodes.map((n) => n.fail);
    return [
      { label: 'text', value: text, role: 'pivot' },
      { label: 'i', value: curI < 0 ? '-' : String(curI), role: 'frontier' },
      { label: 'last', value: `#${curLast}`, role: 'compare' },
      { label: 'len', value: `[${lenArr.join(',')}]`, role: 'default' },
      { label: 'fail', value: `[${failArr.join(',')}]`, role: 'default' },
    ];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const tree = treeToNode(live, highlight, curLast);
    rec.begin(note).setTree(tree).setAux(auxRows()).commit();
    highlight = new Set();
  };

  snapshot({
    zh: `对串 "${text}" 增量构建回文树（奇根 #0 len=-1, 偶根 #1 len=0）`,
    en: `Build palindrome tree for "${text}" online (odd root #0 len=-1, even root #1 len=0)`,
  });

  let distinctFinal = 0;
  live = buildPalindromeTree(text, {
    onCreate: (id, len) => {
      curLast = id;
      curI = live.nodes.length > 0 ? live.nodes[id]!.len - 1 : -1;
      void len;
      snapshot({
        zh: `新建节点 #${id}（len=${len}）`,
        en: `Create node #${id} (len=${len})`,
      });
    },
    onFail: (id, failTo) => {
      highlight = new Set([failTo]);
      curLast = id;
      snapshot({
        zh: `fail(#${id}) = #${failTo}`,
        en: `fail(#${id}) = #${failTo}`,
      });
    },
    onTrans: (from, c, to) => {
      highlight = new Set([from, to]);
      curLast = to;
      snapshot({
        zh: `转移 next(#${from}, '${c}') = #${to}`,
        en: `Transition next(#${from}, '${c}') = #${to}`,
      });
    },
    onStep: (i, last) => {
      curI = i;
      curLast = last;
      snapshot({
        zh: `处理 s[${i}]='${text[i]}'，last = #${last}`,
        en: `Process s[${i}]='${text[i]}', last = #${last}`,
      });
    },
    onCount: (node) => {
      highlight = new Set([node]);
    },
    onDone: (distinct) => {
      distinctFinal = distinct;
    },
  });

  // 终态
  rec
    .begin({
      zh: `完成：${live.nodes.length} 个节点，本质不同回文 ${distinctFinal} 个`,
      en: `Done: ${live.nodes.length} nodes, ${distinctFinal} distinct palindromes`,
    })
    .setTree(treeToNode(live, new Set(), 1))
    .setAux([
      { label: '不同回文数', value: String(distinctFinal), role: 'final' },
      {
        label: '最长回文',
        value: String(Math.max(...live.nodes.map((n) => n.len))),
        role: 'final',
      },
      ...auxRows(),
    ])
    .commit();

  return rec.build();
}
