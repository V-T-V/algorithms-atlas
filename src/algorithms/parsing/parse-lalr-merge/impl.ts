// =============================================================================
// LALR 状态合并 · 纯算法实现
// 输入：一组 LR(1) 状态（每个项目带 lookahead）；按 LR(0) 核分组、合并 lookahead。
// =============================================================================

/** LR(0) 项目（核）：产生式号 + 点位置。 */
export interface Core {
  prodIndex: number;
  dot: number;
}

/** LR(1) 项目：核 + lookahead 集合。 */
export interface LR1Item {
  core: Core;
  lookaheads: string[];
}

/** LR(1) 状态：项目集合。 */
export interface LR1State {
  id: number;
  items: LR1Item[];
}

/** 合并后的 LALR 状态。 */
export interface LALRState {
  /** 用输入状态的 id 列表标识来源。 */
  sourceIds: number[];
  items: LR1Item[];
}

export interface MergeResult {
  /** 每个分组：来源状态 id 列表。 */
  groups: number[][];
  /** 合并后的 LALR 状态。 */
  lalrStates: LALRState[];
  /** 是否存在合并引入的「同核同 lookahead 项目分裂」标记。 */
  mergedCount: number;
}

export interface MergeHooks {
  onGroup?: (sourceIds: number[], mergedItems: LR1Item[]) => void;
  onResult?: (r: MergeResult) => void;
}

/** LR(0) 核字符串键。 */
function coreKey(c: Core): string {
  return `${c.prodIndex}.${c.dot}`;
}

/** 状态的 LR(0) 核签名（项目核排序后连接）。 */
function coreSignature(items: LR1Item[]): string {
  return items
    .map((it) => coreKey(it.core))
    .sort()
    .join('|');
}

/**
 * 合并 LR(1) 状态为 LALR(1)。
 *
 * @param states LR(1) 状态列表
 * @param hooks 可选钩子
 */
export function mergeLALR(states: LR1State[], hooks: MergeHooks = {}): MergeResult {
  // 按核签名分组
  const groupsMap = new Map<string, number[]>(); // sig -> sourceIds
  const groupsItems = new Map<string, LR1State[]>(); // sig -> states
  for (const st of states) {
    const sig = coreSignature(st.items);
    const arr = groupsMap.get(sig) ?? [];
    arr.push(st.id);
    groupsMap.set(sig, arr);
    const itemsArr = groupsItems.get(sig) ?? [];
    itemsArr.push(st);
    groupsItems.set(sig, itemsArr);
  }

  const groups: number[][] = [];
  const lalrStates: LALRState[] = [];
  for (const [sig, sourceIds] of groupsMap) {
    const srcStates = groupsItems.get(sig)!;
    // 合并：相同核的项目 lookahead 取并集
    const lookaheadUnion = new Map<string, Set<string>>(); // coreKey -> set
    for (const st of srcStates) {
      for (const it of st.items) {
        const k = coreKey(it.core);
        const s = lookaheadUnion.get(k) ?? new Set<string>();
        for (const la of it.lookaheads) s.add(la);
        lookaheadUnion.set(k, s);
      }
    }
    const mergedItems: LR1Item[] = [];
    for (const [k, laSet] of lookaheadUnion) {
      const [pi, d] = k.split('.').map((x) => parseInt(x, 10));
      mergedItems.push({ core: { prodIndex: pi!, dot: d! }, lookaheads: [...laSet].sort() });
    }
    // 排序稳定
    mergedItems.sort((a, b) => coreKey(a.core).localeCompare(coreKey(b.core)));
    groups.push([...sourceIds].sort((x, y) => x - y));
    lalrStates.push({ sourceIds: [...sourceIds].sort((x, y) => x - y), items: mergedItems });
    hooks.onGroup?.(
      [...sourceIds].sort((x, y) => x - y),
      mergedItems,
    );
  }

  const result: MergeResult = {
    groups,
    lalrStates,
    mergedCount: lalrStates.length,
  };
  hooks.onResult?.(result);
  return result;
}

/** 检测合并后是否引入 reduce/reduce 冲突：同一核有同一 lookahead 但来源不同的完成项目。 */
export function detectMergeConflicts(
  lalrStates: LALRState[],
  prods: Array<{ lhs: string; rhs: string[] }>,
): Array<{ stateIndex: number; lookahead: string; lhs: string[] }> {
  const conflicts: Array<{ stateIndex: number; lookahead: string; lhs: string[] }> = [];
  for (let i = 0; i < lalrStates.length; i++) {
    const st = lalrStates[i]!;
    // 收集每个 lookahead 上完成的产生式左部
    const laToLhs = new Map<string, Set<string>>();
    for (const it of st.items) {
      const p = prods[it.core.prodIndex];
      if (!p) continue;
      if (it.core.dot >= p.rhs.length) {
        // 完成项目
        for (const la of it.lookaheads) {
          const s = laToLhs.get(la) ?? new Set<string>();
          s.add(p.lhs);
          laToLhs.set(la, s);
        }
      }
    }
    for (const [la, lhsSet] of laToLhs) {
      if (lhsSet.size > 1) {
        conflicts.push({ stateIndex: i, lookahead: la, lhs: [...lhsSet] });
      }
    }
  }
  return conflicts;
}
