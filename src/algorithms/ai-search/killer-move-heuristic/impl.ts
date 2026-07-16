// =============================================================================
// 杀手棋启发（Killer Move Heuristic）· 纯算法实现
// 在通用「带动作」的博弈树上做带 killer 表的 alpha-beta。
// 每个节点显式列出 children，每个 child 关联一个 moveId（用于 killer 表）。
// =============================================================================

export interface KmNode {
  id: string;
  /** 叶子效用（站当前玩家视角）。 */
  utility?: number;
  children?: Array<{ moveId: number; node: KmNode }>;
  /** 搜索后填充的值。 */
  value?: number;
}

/** 每层保留 K 个杀手棋（默认 2，国际象棋常用值）。 */
export interface KillerTable {
  /** killers[ply] = 该层的 killer moveId 列表（最近优先）。 */
  killers: number[][];
}

export function makeKillerTable(maxPly: number, _k: number = 2): KillerTable {
  return { killers: Array.from({ length: maxPly + 1 }, () => []) };
}

/** 把一个 moveId 记入指定层的 killer 表（去重，保持最近优先，最多 K 个）。 */
export function recordKiller(table: KillerTable, ply: number, moveId: number, k: number = 2): void {
  const list = table.killers[ply]!;
  // 已存在则移除（用于提到最前）
  const idx = list.indexOf(moveId);
  if (idx >= 0) list.splice(idx, 1);
  list.unshift(moveId);
  while (list.length > k) list.pop();
}

/** 给某层的子节点排序：killer 棋优先。返回排序后的索引数组。 */
function orderMoves(
  children: Array<{ moveId: number; node: KmNode }>,
  table: KillerTable,
  ply: number,
): number[] {
  const killers = table.killers[ply] ?? [];
  const order = children.map((_, i) => i);
  // 稳定排序：killer 越靠前越优先
  const rank = (moveId: number): number => {
    const idx = killers.indexOf(moveId);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  order.sort((a, b) => rank(children[a]!.moveId) - rank(children[b]!.moveId));
  return order;
}

export interface KmHooks {
  /** 某节点触发 β 剪枝。 */
  onPrune?: (node: KmNode, ply: number, moveId: number) => void;
  /** 记录了一个 killer。 */
  onKillerRecorded?: (ply: number, moveId: number) => void;
  /** 访问了一个节点。 */
  onVisit?: (node: KmNode, ply: number) => void;
}

/**
 * 带 killer move 的 alpha-beta（站当前玩家视角，fail-soft）。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param alpha 下界
 * @param beta 上界
 * @param ply 当前层（距根深度，用于 killer 表索引）
 * @param table killer 表
 * @param k 每层 killer 上限
 * @param hooks 钩子
 */
export function alphaBetaWithKillers(
  node: KmNode,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  table: KillerTable,
  k: number = 2,
  hooks: KmHooks = {},
): number {
  hooks.onVisit?.(node, ply);

  if (depth === 0 || node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }

  const order = orderMoves(node.children, table, ply);
  let best = -Infinity;
  let a = alpha;

  for (const idx of order) {
    const { moveId, node: child } = node.children[idx]!;
    const v = -alphaBetaWithKillers(child, depth - 1, -beta, -a, ply + 1, table, k, hooks);
    if (v > best) {
      best = v;
    }
    if (best > a) a = best;
    if (a >= beta) {
      // β 剪枝：记录 killer
      hooks.onPrune?.(node, ply, moveId);
      recordKiller(table, ply, moveId, k);
      hooks.onKillerRecorded?.(ply, moveId);
      break;
    }
  }

  node.value = best;
  return best;
}

/** 普通 alpha-beta（无 killer），用于结果对照。 */
export function alphaBetaPlain(node: KmNode, depth: number, alpha: number, beta: number): number {
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
  /** 每层的 moveId 起始（用于制造「不同 moveId」便于观察 killer）。 */
  moveIdStart?: number;
}

/** 由叶子效用与分支数构建 m 叉博弈树，每个 child 自动获得唯一 moveId。 */
export function buildTree(spec: FlatSpec): KmNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  let moveCounter = 0;
  const make = (depth: number): KmNode => {
    const id = `k${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: Array<{ moveId: number; node: KmNode }> = [];
    for (let b = 0; b < branching; b++) {
      children.push({ moveId: moveCounter++, node: make(depth - 1) });
    }
    return { id, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth);
}
