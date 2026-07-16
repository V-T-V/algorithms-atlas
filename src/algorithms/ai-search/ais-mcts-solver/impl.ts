// MCTS 求解器 · 实现

export type ProofValue = 'unknown' | 'win' | 'loss';

export interface SolverNode {
  action: number | null;
  parent: SolverNode | null;
  children: SolverNode[];
  untried: number[];
  visits: number;
  proof: ProofValue;
}

export interface SolverDomain<S> {
  legalActions: (s: S) => number[];
  apply: (s: S, a: number) => S;
  /** 返回终局值：1=当前玩家胜，-1=负，0=平/未终局，null=未终局。 */
  terminalValue: (s: S) => number | null;
}

export interface SolverHooks {
  onProven?: (action: number, proof: ProofValue) => void;
  onResult?: (proof: ProofValue) => void;
}

function makeNode(action: number | null, parent: SolverNode | null): SolverNode {
  return { action, parent, children: [], untried: [], visits: 0, proof: 'unknown' };
}

/** 把子节点的证明值传播到父（OR 节点视角：当前玩家选最优）。 */
function propagateProof(node: SolverNode): void {
  if (node.children.length === 0) return;
  // OR 节点：任一子 win -> win；全部 loss -> loss
  let allLoss = true;
  for (const ch of node.children) {
    if (ch.proof === 'win') {
      node.proof = 'win';
      return;
    }
    if (ch.proof !== 'loss') allLoss = false;
  }
  if (allLoss) node.proof = 'loss';
}

/**
 * MCTS Solver：用证明值标记，返回根的证明结果。
 */
export function mctsSolver<S>(
  rootState: S,
  domain: SolverDomain<S>,
  maxIterations: number,
  hooks: SolverHooks = {},
): { proof: ProofValue; root: SolverNode } {
  const root = makeNode(null, null);
  root.untried = domain.legalActions(rootState);

  for (let iter = 0; iter < maxIterations && root.proof === 'unknown'; iter++) {
    let node = root;
    let state = rootState;

    // 选择（跳过已证明节点）
    while (node.proof === 'unknown' && node.untried.length === 0 && node.children.length > 0) {
      const tv = domain.terminalValue(state);
      if (tv !== null) break;
      // 选访问次数最少（偏向探索）的未证明子节点
      const candidates = node.children.filter((c) => c.proof === 'unknown');
      if (candidates.length === 0) {
        propagateProof(node);
        break;
      }
      node = candidates.reduce((a, b) => (a.visits < b.visits ? a : b));
      if (node.action !== null) state = domain.apply(state, node.action);
    }

    if (node.proof !== 'unknown') continue;

    // 检查终局
    const tv = domain.terminalValue(state);
    if (tv !== null) {
      // tv 站在「到达该状态前的行动者」视角：tv=1 表示刚行动的玩家赢
      node.proof = tv > 0 ? 'win' : tv < 0 ? 'loss' : 'unknown';
      // 向上传播
      let cur: SolverNode | null = node;
      while (cur !== null) {
        propagateProof(cur);
        cur = cur.parent;
      }
      continue;
    }

    // 扩展
    if (node.untried.length > 0) {
      const a = node.untried.pop()!;
      state = domain.apply(state, a);
      const child = makeNode(a, node);
      child.untried = domain.legalActions(state);
      node.children.push(child);
      node = child;
      node.visits++;
      // 扩展后立即检查终局
      const ctv = domain.terminalValue(state);
      if (ctv !== null) {
        node.proof = ctv > 0 ? 'win' : ctv < 0 ? 'loss' : 'unknown';
        let cur: SolverNode | null = node;
        while (cur !== null) {
          propagateProof(cur);
          cur = cur.parent;
        }
        hooks.onProven?.(a, node.proof);
        continue;
      }
    }
    // 标记访问
    let cur: SolverNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur = cur.parent;
    }
  }

  hooks.onResult?.(root.proof);
  return { proof: root.proof, root };
}
