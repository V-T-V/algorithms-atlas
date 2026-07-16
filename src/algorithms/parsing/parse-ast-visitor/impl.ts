// =============================================================================
// AST 访问者模式 · 纯算法实现
// 通用 AST 节点 + 深度/广度优先遍历 + 访问者分派。
// =============================================================================

/** 通用 AST 节点。 */
export interface AstNode {
  type: string;
  value?: string | number;
  children?: AstNode[];
}

/** 访问者：每种类型可选 enter/leave。 */
export interface Visitor {
  /** 进入节点（前序）。返回 false 可跳过子树。 */
  enter?: (node: AstNode, depth: number, path: number[]) => boolean | void;
  /** 离开节点（后序）。 */
  leave?: (node: AstNode, depth: number, path: number[]) => void;
  /** 按类型的特定钩子。 */
  visit?: Record<string, (node: AstNode, depth: number) => void>;
}

export interface VisitHooks {
  onEnter?: (node: AstNode, depth: number, path: number[]) => void;
  onLeave?: (node: AstNode, depth: number) => void;
  onVisitType?: (type: string) => void;
}

export interface VisitStats {
  visited: number;
  maxDepth: number;
  countByType: Record<string, number>;
}

/**
 * 深度优先遍历（默认前序 enter，后序 leave）。
 *
 * @param root AST 根
 * @param visitor 访问者
 * @param hooks 可选外部钩子（用于录制）
 */
export function dfsVisit(root: AstNode, visitor: Visitor = {}, hooks: VisitHooks = {}): VisitStats {
  const stats: VisitStats = { visited: 0, maxDepth: 0, countByType: {} };
  const rec = (node: AstNode, depth: number, path: number[]): void => {
    stats.visited++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);
    stats.countByType[node.type] = (stats.countByType[node.type] ?? 0) + 1;
    hooks.onEnter?.(node, depth, path);
    hooks.onVisitType?.(node.type);
    const enterRes = visitor.enter?.(node, depth, path);
    visitor.visit?.[node.type]?.(node, depth);
    if (enterRes !== false && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        rec(node.children[i]!, depth + 1, [...path, i]);
      }
    }
    visitor.leave?.(node, depth, path);
    hooks.onLeave?.(node, depth);
  };
  rec(root, 0, []);
  return stats;
}

/**
 * 广度优先遍历。
 *
 * @param root AST 根
 * @param visitor 访问者（只用 enter）
 * @param hooks 可选钩子
 */
export function bfsVisit(root: AstNode, visitor: Visitor = {}, hooks: VisitHooks = {}): VisitStats {
  const stats: VisitStats = { visited: 0, maxDepth: 0, countByType: {} };
  const queue: Array<{ node: AstNode; depth: number; path: number[] }> = [
    { node: root, depth: 0, path: [] },
  ];
  while (queue.length > 0) {
    const { node, depth, path } = queue.shift()!;
    stats.visited++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);
    stats.countByType[node.type] = (stats.countByType[node.type] ?? 0) + 1;
    hooks.onEnter?.(node, depth, path);
    hooks.onVisitType?.(node.type);
    visitor.enter?.(node, depth, path);
    visitor.visit?.[node.type]?.(node, depth);
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        queue.push({ node: node.children[i]!, depth: depth + 1, path: [...path, i] });
      }
    }
  }
  return stats;
}

/** 统计叶子节点数。 */
export function countLeaves(root: AstNode): number {
  if (!root.children || root.children.length === 0) return 1;
  return root.children.reduce((s, c) => s + countLeaves(c), 0);
}

/** 查找所有某类型节点。 */
export function findAllByType(root: AstNode, type: string): AstNode[] {
  const out: AstNode[] = [];
  dfsVisit(root, {
    enter: (n) => {
      if (n.type === type) out.push(n);
    },
  });
  return out;
}

/** 收集所有叶子值（字符串形式）。 */
export function collectLeafValues(root: AstNode): string[] {
  const out: string[] = [];
  dfsVisit(root, {
    enter: (n) => {
      if ((!n.children || n.children.length === 0) && n.value !== undefined) {
        out.push(String(n.value));
      }
    },
  });
  return out;
}
