// =============================================================================
// 3-SAT 贪心求解 · 纯算法实现
// 子句为正/负文字（正数=变量取真，负数=取假）；贪心按出现频次赋值。
// =============================================================================

/** 一条子句：文字数组，正数为变量编号（取真），负数为取假。0 不允许。 */
export type Clause = number[];

export interface SatResult {
  assignment: Map<number, boolean>;
  satisfied: number;
}

export interface SatHooks {
  onAssign?: (varIdx: number, value: boolean, satisfiedSoFar: number) => void;
  onResult?: (satisfied: number, total: number) => void;
}

export function solve3SatGreedy(
  clauses: Clause[],
  numVars: number,
  hooks: SatHooks = {},
): SatResult {
  const assignment = new Map<number, boolean>();
  // 按变量编号顺序赋值，每变量统计其在未决子句里正/负出现次数
  for (let v = 1; v <= numVars; v++) {
    let pos = 0;
    let neg = 0;
    for (const clause of clauses) {
      // 子句已满足则跳过
      if (clauseSatisfied(clause, assignment)) continue;
      for (const lit of clause) {
        const av = Math.abs(lit);
        if (av === v) {
          if (lit > 0) pos++;
          else neg++;
        }
      }
    }
    const value = pos >= neg; // 正出现多则取真
    assignment.set(v, value);
    const sat = countSatisfied(clauses, assignment);
    hooks.onAssign?.(v, value, sat);
  }
  const satisfied = countSatisfied(clauses, assignment);
  hooks.onResult?.(satisfied, clauses.length);
  return { assignment, satisfied };
}

function clauseSatisfied(clause: Clause, assignment: Map<number, boolean>): boolean {
  for (const lit of clause) {
    const v = Math.abs(lit);
    const a = assignment.get(v);
    if (a === undefined) continue;
    if (lit > 0 && a) return true;
    if (lit < 0 && !a) return true;
  }
  return false;
}

function countSatisfied(clauses: Clause[], assignment: Map<number, boolean>): number {
  let c = 0;
  for (const clause of clauses) if (clauseSatisfied(clause, assignment)) c++;
  return c;
}
