// =============================================================================
// 历史启发（History Heuristic）· 纯算法实现
// 在带 moveId 的通用博弈树上做 α-β，维护全局 history[from][to] 表用于走法排序。
// 每当某走法触发剪枝，history[from][to] += depth*depth（深度平方加权）。
// =============================================================================

export interface HhNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。 */
  utility?: number;
  children?: Array<{ moveId: number; node: HhNode }>;
  /** 搜索后填充的值。 */
  value?: number;
}

/** 全局历史表：history.get(`${from}-${to}`) = 累计得分。 */
export interface HistoryTable {
  scores: Map<string, number>;
}

export function makeHistoryTable(): HistoryTable {
  return { scores: new Map() };
}

export function historyKey(fromMove: number, toMove: number): string {
  return `${fromMove}-${toMove}`;
}

/** 记一次剪枝：得分 += depth² 。 */
export function recordCutoff(
  table: HistoryTable,
  fromMove: number,
  toMove: number,
  depth: number,
): void {
  const key = historyKey(fromMove, toMove);
  table.scores.set(key, (table.scores.get(key) ?? 0) + depth * depth);
}

/** 获取某走法的当前历史得分。 */
export function historyScore(table: HistoryTable, fromMove: number, toMove: number): number {
  return table.scores.get(historyKey(fromMove, toMove)) ?? 0;
}

export interface HhHooks {
  /** 进入某节点开始搜索。 */
  onVisit?: (node: HhNode, ply: number) => void;
  /** 用 history 表对子节点排序后，给出新的索引顺序。 */
  onOrder?: (node: HhNode, ply: number, order: number[], fromMove: number | null) => void;
  /** 某走法触发剪枝。 */
  onPrune?: (node: HhNode, ply: number, fromMove: number, toMove: number, depth: number) => void;
}

/**
 * 带 history 启发的 α-β（站当前玩家视角，fail-soft）。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param alpha 下界
 * @param beta 上界
 * @param ply 距根深度
 * @param table 全局历史表
 * @param fromMove 进入本节点所走的走法（根为 null）
 * @param hooks 钩子
 */
export function alphaBetaWithHistory(
  node: HhNode,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  table: HistoryTable,
  fromMove: number | null = null,
  hooks: HhHooks = {},
): number {
  hooks.onVisit?.(node, ply);

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }

  const children = node.children;
  // 按 history 得分降序排序（稳定：相同得分保持原序）
  const order = children.map((_, i) => i);
  const fromM = fromMove ?? -1;
  order.sort((a, b) => {
    const ca = children[a]!.moveId;
    const cb = children[b]!.moveId;
    return historyScore(table, fromM, cb) - historyScore(table, fromM, ca);
  });
  hooks.onOrder?.(node, ply, [...order], fromMove);

  let best = -Infinity;
  let a = alpha;

  for (const idx of order) {
    const { moveId, node: child } = children[idx]!;
    const v = -alphaBetaWithHistory(child, depth - 1, -beta, -a, ply + 1, table, moveId, hooks);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) {
      // β 剪枝：记录到 history 表
      recordCutoff(table, fromM, moveId, depth);
      hooks.onPrune?.(node, ply, fromM, moveId, depth);
      break;
    }
  }

  node.value = best;
  return best;
}

/** 普通 α-β（无 history），用于结果对照。 */
export function alphaBetaPlain(node: HhNode, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  let a = alpha;
  for (const { node: child } of node.children) {
    const v = -alphaBetaPlain(child, depth - 1, -beta, -a);
    if (v > best) best = v;
    if (best > a) a = best;
    if (a >= beta) break;
  }
  node.value = best;
  return best;
}

// —— 构建示例树（带 moveId）—— -----------------------------------------------

export interface FlatSpec {
  /** 叶子效用（按先序顺序）。 */
  utilities: number[];
  /** 每层分支数。 */
  branching: number;
}

/** 由叶子效用与分支数构建 m 叉博弈树，每个 child 自动获得唯一 moveId。 */
export function buildTree(spec: FlatSpec): HhNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  let moveCounter = 0;
  const make = (depth: number): HhNode => {
    const id = `h${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: Array<{ moveId: number; node: HhNode }> = [];
    for (let b = 0; b < branching; b++) {
      children.push({ moveId: moveCounter++, node: make(depth - 1) });
    }
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
