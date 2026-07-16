// SSS* 算法 · 实现

export interface SssNode {
  id: string;
  utility?: number; // 叶子效用（MAX 视角）
  children?: SssNode[];
  parent?: SssNode;
  type?: 'max' | 'min';
}

type SssStateType = 'live' | 'solved';

interface SssState {
  node: SssNode;
  type: SssStateType;
  h: number;
}

export interface SssHooks {
  onPop?: (nodeId: string, h: number) => void;
  onSolve?: (value: number) => void;
}

/** 为节点树填充 parent 和 type 字段（根=max，交替）。 */
export function annotate(node: SssNode, parent?: SssNode, type: 'max' | 'min' = 'max'): void {
  node.parent = parent;
  node.type = type;
  if (node.children) {
    for (const c of node.children) annotate(c, node, type === 'max' ? 'min' : 'max');
  }
}

/**
 * SSS* 算法。返回根的博弈值（MAX 视角）。
 * 标准状态集实现：open list 按 h 升序。
 */
export function sssStar(root: SssNode, hooks: SssHooks = {}): number {
  annotate(root);
  const open: SssState[] = [{ node: root, type: 'live', h: Infinity }];

  const isLeaf = (n: SssNode): boolean => !n.children || n.children.length === 0;

  while (open.length > 0) {
    open.sort((a, b) => a.h - b.h);
    const s = open.shift()!;
    hooks.onPop?.(s.node.id, s.h);

    if (s.type === 'live') {
      if (isLeaf(s.node)) {
        const util = s.node.utility ?? 0;
        open.push({ node: s.node, type: 'solved', h: Math.min(s.h, util) });
      } else if (s.node.type === 'max') {
        // MAX live：展开为「最左子 live」+ 本节点转为「等待子 solved」
        open.push({ node: s.node.children![0]!, type: 'live', h: s.h });
      } else {
        // MIN live：插入第一个子
        open.push({ node: s.node.children![0]!, type: 'live', h: s.h });
      }
    } else {
      // solved
      if (s.node === root) {
        hooks.onSolve?.(s.h);
        return s.h;
      }
      const parent = s.node.parent!;
      const idx = parent.children!.indexOf(s.node);
      if (parent.type === 'max') {
        // MAX 父：第一个子 solved 后，父即 solved（取该值）；其余子剪枝
        for (let ii = open.length - 1; ii >= 0; ii--) {
          if (open[ii]!.node === parent) open.splice(ii, 1);
        } // 移除父的其它状态
        open.push({ node: parent, type: 'solved', h: s.h });
      } else {
        // MIN 父：需所有子 solved 后取 min
        const nextChild = parent.children![idx + 1];
        if (nextChild !== undefined) {
          open.push({ node: nextChild, type: 'live', h: s.h });
        } else {
          // 所有子已 solved，父 solved
          open.push({ node: parent, type: 'solved', h: s.h });
        }
      }
    }
    if (open.length > 100000) break;
  }
  return minimaxMax(root);
}

function minimaxMax(node: SssNode): number {
  if (!node.children || node.children.length === 0) return node.utility ?? 0;
  return Math.max(...node.children.map((c) => minimaxMin(c)));
}
function minimaxMin(node: SssNode): number {
  if (!node.children || node.children.length === 0) return node.utility ?? 0;
  return Math.min(...node.children.map((c) => minimaxMax(c)));
}
