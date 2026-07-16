// =============================================================================
// 证明数搜索 · 录制帧序列
// 用 setTree 展示 AND-OR 树（节点 value 显示 pn/dn），setAux 显示迭代与根状态。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { proofNumberSearch, type PnHooks, type PnNode } from './impl.ts';

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `v${nodeIdCounter}`;
}

function toViz(node: PnNode, highlight: Set<string>, expanded: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (node.proof === 0) role = 'final';
  else if (node.disproof === 0) role = 'sorted';
  else if (expanded.has(node.id)) role = 'frontier';
  const typeLabel = node.type === 'OR' ? 'OR' : 'AND';
  const stateLabel = node.leafState
    ? node.leafState === 'proven'
      ? 'WIN'
      : node.leafState === 'disproven'
        ? 'LOSE'
        : '?'
    : '';
  return {
    id: nextId(),
    value: `${typeLabel}${stateLabel ? `/${stateLabel}` : ''}\npn=${node.proof} dn=${node.disproof}`,
    role,
    children: node.children?.map((c) => toViz(c, highlight, expanded)),
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  // 构造一棵小型 AND-OR 树：
  // OR(root) -> [AND(a), AND(b)]
  //   AND(a) -> [OR(a1)[leaf unknown], OR(a2)[leaf disproven]]
  //   AND(b) -> [leaf proven]  （子尚未展开，由 expander 模拟）
  // 根是 OR，要证明只需 a 或 b 之一被证明。
  const root: PnNode = {
    id: 'root',
    type: 'OR',
    proof: 1,
    disproof: 1,
    expanded: false,
  };

  const highlight = new Set<string>();
  const expanded = new Set<string>();

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, expanded))
      .setAux([
        { label: '根 pn', value: String(root.proof), role: 'frontier' },
        { label: '根 dn', value: String(root.disproof), role: 'frontier' },
        {
          label: '根状态',
          value: root.proof === 0 ? '已证明' : root.disproof === 0 ? '已反证' : '未决',
          role: (root.proof === 0 || root.disproof === 0 ? 'final' : 'pivot') as BarRole,
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `初始 AND-OR 树：根为 OR，待展开`,
    en: `Initial AND-OR tree: root is OR, unexpanded`,
  });

  // expander：给一个叶子生成子节点
  // root -> [AND(a)[OR(a1)=unknown, OR(a2)=disproven], proven-leaf]
  // 设计成一次展开根即可证明（root 是 OR，proven-leaf 使 root.proof=0）
  let callCount = 0;
  const expander = (leaf: PnNode): PnNode[] => {
    callCount++;
    void leaf;
    // 第一次展开根：给两个 AND 子节点
    if (callCount === 1) {
      const andA: PnNode = {
        id: 'a',
        type: 'AND',
        proof: 1,
        disproof: 1,
        expanded: false,
      };
      andA.children = [
        { id: 'a1', type: 'OR', leafState: 'unknown', proof: 1, disproof: 1, expanded: false },
        { id: 'a2', type: 'OR', leafState: 'disproven', proof: 1, disproof: 1, expanded: false },
      ];
      const andB: PnNode = {
        id: 'b',
        type: 'AND',
        proof: 1,
        disproof: 1,
        expanded: false,
      };
      andB.children = [
        { id: 'b1', type: 'OR', leafState: 'proven', proof: 1, disproof: 1, expanded: false },
      ];
      return [andA, andB];
    }
    // 后续展开返回空（叶子真值固定）
    return [];
  };

  const hooks: PnHooks = {
    onIter: (iter) => {
      void iter;
    },
    onExpand: (leafId) => {
      highlight.add(leafId);
      expanded.add(leafId);
    },
    onRootUpdate: (proof, disproof) => {
      snapshot({
        zh: `回传后：根 pn=${proof} dn=${disproof}`,
        en: `After backprop: root pn=${proof} dn=${disproof}`,
      });
    },
  };

  const result = proofNumberSearch(root, expander, 20, hooks);

  nodeIdCounter = 0;
  rec
    .begin({
      zh: `完成：${result.proven ? '已证明（OR 根存在必胜分支）' : result.disproven ? '已反证' : '未决'}，迭代 ${result.iterations}`,
      en: `Done: ${result.proven ? 'proven (OR root has a winning branch)' : result.disproven ? 'disproven' : 'unresolved'}, ${result.iterations} iters`,
    })
    .setTree(toViz(root, new Set(), expanded))
    .setAux([
      {
        label: '结论',
        value: result.proven ? '证明' : result.disproven ? '反证' : '未决',
        role: 'final',
      },
      { label: '迭代', value: String(result.iterations), role: 'final' },
      { label: '根 pn', value: String(root.proof), role: 'final' },
      { label: '根 dn', value: String(root.disproof), role: 'final' },
    ])
    .commit();

  return rec.build();
}
