// =============================================================================
// 死代码消除 · 纯算法实现
// 简单线性 IR：Assign / Return / Expr。
//   1) 不可达消除：Return 后的语句标记为死。
//   2) 未用赋值消除：后向活跃变量分析，赋给非活跃变量的 Assign 删除。
// =============================================================================

export type Stmt =
  | { kind: 'assign'; target: string; uses: string[] }
  | { kind: 'return'; uses: string[] }
  | { kind: 'expr'; uses: string[] };

export interface ElimResult {
  stmts: Stmt[];
  removedUnreachable: number;
  removedDeadAssign: number;
}

export interface DCEHooks {
  onUnreachable?: (stmt: Stmt, index: number) => void;
  onDeadAssign?: (stmt: Stmt, index: number) => void;
  onResult?: (r: ElimResult) => void;
}

/** 第一步：移除 return 后的不可达语句。 */
export function removeUnreachable(
  stmts: Stmt[],
  hooks: DCEHooks = {},
): { stmts: Stmt[]; removed: number } {
  const out: Stmt[] = [];
  let removed = 0;
  let terminated = false;
  for (let i = 0; i < stmts.length; i++) {
    const s = stmts[i]!;
    if (terminated) {
      removed++;
      hooks.onUnreachable?.(s, i);
      continue;
    }
    out.push(s);
    if (s.kind === 'return') terminated = true;
  }
  return { stmts: out, removed };
}

/** 后向活跃变量分析，返回每条语句执行「之前」的活跃变量集。 */
export function liveness(stmts: Stmt[]): Set<string>[] {
  const liveBefore: Set<string>[] = stmts.map(() => new Set<string>());
  let liveAfter = new Set<string>();
  for (let i = stmts.length - 1; i >= 0; i--) {
    const s = stmts[i]!;
    const before = new Set<string>(liveAfter);
    if (s.kind === 'assign') {
      before.delete(s.target);
      for (const u of s.uses) before.add(u);
    } else {
      for (const u of s.uses) before.add(u);
    }
    liveBefore[i] = before;
    liveAfter = before;
  }
  return liveBefore;
}

/**
 * 完整 DCE：先去不可达，再去死赋值。
 *
 * @param stmts IR
 * @param hooks 可选钩子
 */
export function eliminateDeadCode(stmts: Stmt[], hooks: DCEHooks = {}): ElimResult {
  const { stmts: afterUnreach, removed: removedUnreachable } = removeUnreachable(stmts, hooks);
  // 死赋值消除：赋给「该语句之后不再活跃」的变量的 Assign 删除
  const liveBefore = liveness(afterUnreach);
  const out: Stmt[] = [];
  let removedDeadAssign = 0;
  for (let i = 0; i < afterUnreach.length; i++) {
    const s = afterUnreach[i]!;
    if (s.kind === 'assign') {
      // 检查 target 在「执行本语句之后」（即下一条的 liveBefore，若无则空集）是否活跃
      const liveAfterThis = i + 1 < afterUnreach.length ? liveBefore[i + 1]! : new Set<string>();
      if (!liveAfterThis.has(s.target)) {
        removedDeadAssign++;
        hooks.onDeadAssign?.(s, i);
        continue;
      }
    }
    out.push(s);
  }
  const result: ElimResult = {
    stmts: out,
    removedUnreachable,
    removedDeadAssign,
  };
  hooks.onResult?.(result);
  return result;
}
