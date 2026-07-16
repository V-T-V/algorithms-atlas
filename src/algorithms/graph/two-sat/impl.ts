// =============================================================================
// 2-SAT（合取范式的可满足性）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心：把每个子句 (a∨b) 转成两条蕴含 ¬a→b、¬b→a，建「蕴含图」（2n 个节点），
//      求其 SCC。若某变量 x 与 ¬x 同属一个 SCC 则无解；否则按 SCC 拓扑序（反序）赋值。
// =============================================================================

/** 一个文字：变量索引 var 与是否取非 neg。 */
export interface Literal {
  /** 变量索引，0-based。 */
  var: number;
  /** true 表示取非 (¬var)，false 表示原形 (var)。 */
  neg: boolean;
}

/** 2-SAT 输入：变量个数 + 子句列表。 */
export interface TwoSatInput {
  /** 变量个数 n（变量索引 0..n-1）。 */
  n: number;
  /** 子句列表，每个为两个文字的析取。 */
  clauses: ReadonlyArray<[Literal, Literal]>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface TwoSatHooks {
  /** 添加一条蕴含边 from→to（from/to 为蕴含图节点 id 字符串）。 */
  onImplication?: (from: string, to: string) => void;
  /** 发现一个 SCC：该分量包含的节点 id 列表。 */
  onComponent?: (component: string[]) => void;
  /** 判定第 i 个变量不可满足（x 与 ¬x 同 SCC）。 */
  onContradiction?: (i: number) => void;
  /** 求解完成：是否可满足 + 各变量赋值（不可满足时为 null）。 */
  onDone?: (sat: boolean, assignment: boolean[] | null) => void;
}

/** 结果。 */
export interface TwoSatResult {
  /** 是否可满足。 */
  sat: boolean;
  /** 各变量赋值（不可满足时为 null）。 */
  assignment: boolean[] | null;
}

/** 文字 → 蕴含图节点 id。变量 i：正形 = `i`，取非 = `!i`。 */
export function litId(lit: Literal): string {
  return lit.neg ? `!${lit.var}` : `${lit.var}`;
}

/** 取一个文字的非。 */
function negate(lit: Literal): Literal {
  return { var: lit.var, neg: !lit.neg };
}

/** 蕴含图全部节点 id（供 trace）。 */
export function allNodeIds(n: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    ids.push(`${i}`);
    ids.push(`!${i}`);
  }
  return ids;
}

/**
 * 2-SAT 求解（蕴含图 + Tarjan SCC + 拓扑逆序赋值）。
 *
 * - 对每个子句 (a ∨ b)：加边 ¬a→b、¬b→a
 * - 求所有 SCC；若存在 i 使 i 与 ¬i 在同一 SCC → 不可满足
 * - 否则按 SCC 编号（拓扑逆序，编号大者先决定）赋值：
 *   `assignment[i] = (comp[i] > comp[¬i])`，即拓扑序更靠后的分量取真
 *
 * 复杂度 `O(n + m)`（n 变量、m 子句）。
 *
 * @param input 2-SAT 输入
 * @param hooks 可选事件钩子
 */
export function twoSat(input: TwoSatInput, hooks: TwoSatHooks = {}): TwoSatResult {
  const { n, clauses } = input;
  // 邻接表：节点 id -> 目标 id 列表
  const adj = new Map<string, string[]>();
  const nodeSet = new Set<string>();
  for (let i = 0; i < n; i++) {
    const pos = `${i}`;
    const neg = `!${i}`;
    nodeSet.add(pos);
    nodeSet.add(neg);
    adj.set(pos, []);
    adj.set(neg, []);
  }

  // 建蕴含边
  for (const [a, b] of clauses) {
    const na = negate(a);
    const nb = negate(b);
    adj.get(litId(na))!.push(litId(b));
    hooks.onImplication?.(litId(na), litId(b));
    adj.get(litId(nb))!.push(litId(a));
    hooks.onImplication?.(litId(nb), litId(a));
  }

  // Tarjan SCC（迭代版，避免深递归栈溢出）
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const compOf = new Map<string, number>();
  let timer = 0;
  let compCount = 0;

  // 迭代 DFS 栈帧
  type Frame = { node: string; ei: number };
  for (const start of nodeSet) {
    if (dfn.has(start)) continue;
    const callStack: Frame[] = [{ node: start, ei: 0 }];
    dfn.set(start, ++timer);
    low.set(start, timer);
    stack.push(start);
    onStack.add(start);

    while (callStack.length > 0) {
      const top = callStack[callStack.length - 1]!;
      const neighbors = adj.get(top.node) ?? [];
      if (top.ei < neighbors.length) {
        const w = neighbors[top.ei]!;
        top.ei++;
        if (!dfn.has(w)) {
          dfn.set(w, ++timer);
          low.set(w, timer);
          stack.push(w);
          onStack.add(w);
          callStack.push({ node: w, ei: 0 });
        } else if (onStack.has(w)) {
          low.set(top.node, Math.min(low.get(top.node) ?? Infinity, dfn.get(w) ?? Infinity));
        }
      } else {
        // 回溯
        callStack.pop();
        if ((low.get(top.node) ?? Infinity) === (dfn.get(top.node) ?? Infinity)) {
          const comp: string[] = [];
          let w: string;
          do {
            w = stack.pop()!;
            onStack.delete(w);
            compOf.set(w, compCount);
            comp.push(w);
          } while (w !== top.node);
          compCount++;
          hooks.onComponent?.(comp);
        }
        // 用子 low 更新父 low
        const parent = callStack[callStack.length - 1];
        if (parent) {
          low.set(
            parent.node,
            Math.min(low.get(parent.node) ?? Infinity, low.get(top.node) ?? Infinity),
          );
        }
      }
    }
  }

  // 矛盾检测 + 赋值
  // Tarjan 按拓扑逆序发现 SCC：编号小者拓扑序靠后（更接近汇点），
  // 故对变量 i，取 comp 编号较小的一方为真（即拓扑序靠后的一方）。
  const assignment = new Array<boolean>(n).fill(false);
  let sat = true;
  for (let i = 0; i < n; i++) {
    const cp = compOf.get(`${i}`)!;
    const cn = compOf.get(`!${i}`)!;
    if (cp === cn) {
      sat = false;
      hooks.onContradiction?.(i);
    }
    // comp 编号小者（拓扑序靠后）为真
    assignment[i] = cp < cn;
  }

  hooks.onDone?.(sat, sat ? assignment : null);
  return { sat, assignment: sat ? assignment : null };
}
